import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../components/auth/auth.module';

@Module({
  imports: [AuthModule], //murojat qilayotgan user shaxsini aniqlash uchun AuthModuleni import qilamiz
  providers: [SocketGateway]
})
export class SocketModule { }
