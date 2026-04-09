import { forwardRef, Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Member", schema: MemberSchema }]),
    forwardRef(() => AuthModule) // <--- AuthModule shu yerda bo'lishi shart
  ],
  providers: [MemberResolver, MemberService],
  exports: [MemberService], // Buni ham qo'shib qo'yish zarar qilmaydi
})
export class MemberModule {}