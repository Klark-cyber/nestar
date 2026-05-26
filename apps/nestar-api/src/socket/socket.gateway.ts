import { Logger } from '@nestjs/common'; // NestJS logger import qilinmoqda
import {
  OnGatewayInit, // gateway initialize lifecycle
  SubscribeMessage, // websocket event subscribe qilish decoratori
  WebSocketGateway, // websocket gateway yaratish decoratori
  WebSocketServer // websocket server instance olish decoratori
} from '@nestjs/websockets';
import { Server } from 'ws'; // ws package ichidagi websocket server type
import * as WebSocket from "ws"; // websocket client type

/*
Ketma-ket ishlash jarayoni:

Server ishga tushadi
afterInit() ishlaydi
Frontend websocket ulanadi
handleConnection() ishlaydi
User message yuboradi
handleMessage() ishlaydi
Barcha clientlarga message jo‘natiladi
User chiqib ketadi
handleDisconnect() ishlaydi*/

interface MessagePayload { // oddiy message object structure
  event: string; // event nomi
  text: string; // yuboriladigan habar
}

interface InfoPayload { // online user sonini yuborish uchun object
  event: string; // event nomi
  totalClients: number; // nechta client online
}


@WebSocketGateway({
  transports: ['websocket'], // faqat websocket transport ishlaydi
  secure: false // http mode
})

export class SocketGateway implements OnGatewayInit {

  private logger: Logger = new Logger('SocketEventsGateway'); // logger object

  private summaryClient: number = 0; // online userlar soni


  @WebSocketServer()
  server: Server; // websocket server instance



  public afterInit(server: Server) { // server initialize bo‘lganda ishlaydi

    this.logger.verbose( // terminalga log chiqaradi
      `WebSocket Server Initialized total: ${this.summaryClient}`
    );
  }



  handleConnection(client: WebSocket, ...args: any[]) { // yangi client ulanganda ishlaydi

    this.summaryClient++; // online user sonini oshiramiz

    this.logger.verbose( // log chiqaramiz
      `Connected & total: ${this.summaryClient} ==`
    );

    const infoMsg: InfoPayload = { // barcha clientlarga yuboriladigan object

      event: "info", // event nomi

      totalClients: this.summaryClient // online user soni
    }

    this.emitMessage(infoMsg) // barcha clientlarga yuboramiz
  }



  handleDisconnect(client: WebSocket) { // client disconnect bo‘lganda ishlaydi

    this.summaryClient--; // online user sonini kamaytiramiz

    this.logger.verbose( // log chiqaramiz
      `Disonnected & total: ${this.summaryClient} ==`
    );

    const infoMsg: InfoPayload = { // online user sonini yuboruvchi object

      event: "info", // event nomi

      totalClients: this.summaryClient // qolgan online userlar soni
    }

    this.broadcastMessage(client, infoMsg) // disconnect bo‘lgan userdan tashqari barchaga yuboradi
  };



  @SubscribeMessage('message') // frontenddan "message" event kelganda ishlaydi

  public async handleMessage(
    client: WebSocket,
    payload: any
  ): Promise<string> {

    const newMessage: MessagePayload = { // yangi message object

      event: "message", // event nomi

      text: payload // frontend yuborgan habar
    }

    this.logger.verbose(`NEW MESSAGE: ${payload}`); // terminalga message chiqaradi

    this.emitMessage(newMessage) // barcha clientlarga message yuboradi

    return 'Hello world!'; // frontendga response qaytaradi
  }



  private broadcastMessage(
    sender: WebSocket,
    message: InfoPayload | MessagePayload
  ) {

    this.server.clients.forEach((client) => { // barcha clientlarni aylanish

      if (
        client !== sender && // disconnect bo‘lgan user emasligini tekshiradi
        client.readyState === WebSocket.OPEN // websocket online ekanligini tekshiradi
      )

        client.send(JSON.stringify(message)) // clientga json yuboradi
    })
  }



  private emitMessage(
    message: InfoPayload | MessagePayload
  ) {

    this.server.clients.forEach((client) => { // barcha clientlarni aylanish

      if (client.readyState === WebSocket.OPEN) // client online bo‘lsa

        client.send(JSON.stringify(message)) // clientga message yuboradi
    })
  }
}