import { Logger } from '@nestjs/common'; // NestJS logger import qilinmoqda
import {
  OnGatewayInit, // gateway initialize lifecycle
  SubscribeMessage, // websocket event subscribe qilish decoratori
  WebSocketGateway, // websocket gateway yaratish decoratori
  WebSocketServer // websocket server instance olish decoratori
} from '@nestjs/websockets';
import { Server } from 'ws'; // ws package ichidagi websocket server type
import * as WebSocket from "ws"; // websocket client type
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from "url" //urlda kelayotgan param va queryni ushlash uchun package

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
  memberData: Member | null; //kim data yuborayotganini qoshamiz
}

interface InfoPayload { // online user sonini yuborish uchun object
  event: string; // event nomi
  totalClients: number; // nechta client online
  memberData: Member | null;
  action: string; //join yoki left uchun
}

@WebSocketGateway({
  transports: ['websocket'], // faqat websocket transport ishlaydi
  secure: false // http mode
})

export class SocketGateway implements OnGatewayInit {
  private logger: Logger = new Logger('SocketEventsGateway'); // logger object
  private summaryClient: number = 0; // online userlar soni
  private clientsAuthMap = new Map<WebSocket, Member | null>()//Map key sifatida string emas object saqlovchi data type. key=WebSocket, value=Member. Mapning objectdan farqi key sifatida string emas object saqlash xususiyatida.
  private messagesList: MessagePayload[] = [] //yangi user kirganda unga u kirishidan oldin yozilgan eng songi 5 ta habarni korsatamiz


  constructor(private authService: AuthService) { } //class ichiga AuthServicedan instance hosil qildik

  @WebSocketServer()
  server: Server; // websocket server instance

  public afterInit(server: Server) { // server ishga tushganda ishlaydi
    this.logger.verbose( // terminalga log chiqaradi
      `WebSocket Server Initialized total: ${this.summaryClient}`
    );
  }

  private async retrieveAuth(req: any): Promise<Member | null> { //request qilgan clientni aniqlash uchun method.
    try {
      const parseUrl = url.parse(req.url, true) //requestdan kelayotgan urldan tokenni ajratib olib tokendan member kimligioni aniqlaymiz
      const { token } = parseUrl.query
      return await this.authService.verifyToken(token as string);
    } catch (err) {
      return null; //auth bolmagan user request qilsa ishga tushadi
    }

  }

  public async handleConnection(client: WebSocket, req: any) { // yangi client ulanganda ishlaydi
    const authMember = await this.retrieveAuth(req);
    this.summaryClient++; // online user sonini oshiramiz

    const clientNick: string = authMember?.memberNick ?? "Guest" //client ismini log qilamiz.Agar user log bolmagan bolsa u guest hisoblanadi
    this.clientsAuthMap.set(client, authMember) //har bir klientni serverda kimligi va uninhg malumotlarini key:value korinishida saqlab qoyamiz
    this.logger.verbose( // log chiqaramiz
      `Connection [${clientNick}] & total: ${this.summaryClient} ==`
    );

    const infoMsg: InfoPayload = { // barcha clientlarga yuboriladigan object
      event: "info", // event nomi
      totalClients: this.summaryClient, // online user soni
      memberData: authMember,
      action: 'joined'

    }
    this.emitMessage(infoMsg) // barcha clientlarga yuboramiz

    //yangi user kirganda unga u kirishidan oldin yozilgan eng songi 5 ta habarni korsatamiz
    client.send(JSON.stringify({ event: "getMessages", list: this.messagesList })) //eng songi ulangan clientga message yuborish.messagesList bu yozishmalardagi habarlarni ozida saqlovchi array

  }

  public handleDisconnect(client: WebSocket) { // client disconnect bo‘lganda ishlaydi
    const authMember = this.clientsAuthMap.get(client) ?? null; //member connect bolganda handleConnection ichida clientsAuthMapga set orqali memberni datasini kiritdik endi u chatni tark etganda get orqali uning kimligini aniqlaymiz.null qoyishga sabab authmember null bolishi ham mumkin 
    this.summaryClient--; // online user sonini kamaytiramiz

    this.clientsAuthMap.delete(client) //serverdan serveerdan chiqib ketgan user malumotini ochiramiz
    const clientNick: string = authMember?.memberNick ?? "Guest" //client ismini log qilamiz.Agar user log bolmagan bolsa u guest hisoblanadi
    this.logger.verbose( // log chiqaramiz
      `Disonnected [${clientNick}] & total: ${this.summaryClient} ==`
    );

    const infoMsg: InfoPayload = { // online user sonini yuboruvchi object
      event: "info", // event nomi
      totalClients: this.summaryClient, // qolgan online userlar soni
      memberData: authMember,
      action: 'left',
    }
    this.broadcastMessage(client, infoMsg) // disconnect bo‘lgan userdan tashqari barchaga yuboradi
  };

  @SubscribeMessage('message') // frontenddan "message" kalit sozi orqali yuborilgan matnni ushlaymiz

  public async handleMessage(client: WebSocket, payload: string): Promise<void> {
    const authMember = this.clientsAuthMap.get(client) ?? null; //member connect bolganda handleConnection ichida clientsAuthMapga set orqali memberni datasini kiritdik endi u chatni tark etganda get orqali uning kimligini aniqlaymiz.null qoyishga sabab authmember null bolishi ham mumkin 
    const newMessage: MessagePayload = {
      event: "message", // event nomi 
      text: payload, // frontend yuborgan habar
      memberData: authMember,
    }
    const clientNick: string = authMember?.memberNick ?? "Guest"

    this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${payload}`); // terminalga message chiqaradi

    this.messagesList.push(newMessage) //kiritilgan xabarlarni arrayga yuklab qoyamiz
    if (this.messagesList.length > 5) this.messagesList.splice(0, this.messagesList.length - 5); //oxirgi kirgan user eng songi yozilgan 5 ta habarni oqiydi

    this.emitMessage(newMessage) // barcha clientlarga message yuboradi
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