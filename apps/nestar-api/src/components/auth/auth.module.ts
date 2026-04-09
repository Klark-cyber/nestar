import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MemberModule } from '../member/member.module'; // Yo'lni tekshiring

@Module({
  imports: [],  // forwardRef va MemberModule olib tashlang
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}