import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, } from 'ws';
import * as WebSocket from "ws"

interface MessagePayload { //frontendga malumot yuborish va qabul qilish uchun interface
  event: string;
  text: string;
}

interface InfoPayload {//yangi klient qoshilganda boshqa userlarga bildirishnoma yuborish uchun interface
  event: string;
  totalClients: number;
}

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger('SocketEventsGateway');
  private summaryClient: number = 0;

  @WebSocketServer()
  server: Server;


  public afterInit(server: Server) {
    this.logger.verbose(`WebSocket Server Initialized total: ${this.summaryClient}`); //socket uchun kiruvchi va chiquvchi malumotlarni boshqa rangda log qilamiz
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    this.summaryClient++;
    this.logger.verbose(`Connected & total: ${this.summaryClient} ==`);

    const infoMsg: InfoPayload = { //serverga ulangan userlar sonini barcha clientga korsatish mantigi
      event: "info",
      totalClients: this.summaryClient
    }
    this.emitMessage(infoMsg)
  }

  handleDisconnect(client: WebSocket) { //setdan chiqib ketgan userdan tashqari barchaga user left bolganini yetkazamiz
    this.summaryClient--;
    this.logger.verbose(`Disonnected & total: ${this.summaryClient} ==`);
    //client == disconnect user
    const infoMsg: InfoPayload = { //serverga ulangan userlar sonini barcha clientga korsatish mantigi
      event: "info",
      totalClients: this.summaryClient
    }
    this.broadcastMessage(client, infoMsg)
  };

  @SubscribeMessage('message')
  public async handleMessage(client: WebSocket, payload: any): Promise<string> {
    const newMessage: MessagePayload = { event: "message", text: payload } //yangi message hosil qilamiz
    this.logger.verbose(`NEW MESSAGE: ${payload}`);
    this.emitMessage(newMessage) //barcha ulangan clientlarga habar yuboramiz
    return 'Hello world!';
  }

  private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) { //sender setdan chiqib ketgan user
    this.server.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) //client qiymati tarmoqdan chiqqan senderga teng bolmasa 
        client.send(JSON.stringify(message)) //online userga message yuboramiz
    })
  }


  private emitMessage(message: InfoPayload | MessagePayload) { //emitMessage bu method barcha klientlarga message yuborish uchun xizmat qiladi
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) //serverga ulangan user online bolsa
        client.send(JSON.stringify(message)) //online userga message yuboramiz
    })
  }
}
