import { BadRequestException, forwardRef, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from "mongoose"
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MemberService {
    constructor(@InjectModel("Member") private readonly memberModel: Model<Member>, 
    @Inject(forwardRef(() => AuthService)) // <--- MANA SHU QATORNI QO'SHING
    private readonly authService: AuthService,
    ){}

    public async signup(input: MemberInput): Promise<Member> {
        //TODO: HASH password
        input.memberPassword = await this.authService.hashPassword(input.memberPassword); //graphqlda servise modelda try catch ishlatish shart emas ammo yuzaga keladiugan errorni handle qilish uchun try/catchdan foydalkandik
        try{
        //TODO: Authentification via TOKEN
        const result = await this.memberModel.create(input);
        result.accessToken = await this.authService.createToken(result) //jwt hosil qilamiz
        return result;
        }catch(err){
        console.log("Error, Servise.model:", err.message)
        throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
        }
    }

    public async login(input: LoginInput): Promise<Member> {
        console.log("STEP-5")
        const {memberNick, memberPassword } = input;
        const response: Member = await this.memberModel
        .findOne({memberNick: memberNick})
        .select('+memberPassword') //defolt memberPassword memberPassword olib berilmas edi endi olib beriladi
        .exec() as Member;

        if(!response || response.memberStatus === MemberStatus.DELETE){
            throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
        }else if(response.memberStatus === MemberStatus.BLOCK){
            throw new InternalServerErrorException(Message.BLOCKED_USER); 
        }
        //TODO: compare password

        const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword as string);
        if(!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD); 
        response.accessToken = await this.authService.createToken(response);
        return response
    } 

    public async updateMember(): Promise<string> {
         return "updateMember executed";
    }

    public async getMember(): Promise<string> {
        return "getMember executed";
    }
}
