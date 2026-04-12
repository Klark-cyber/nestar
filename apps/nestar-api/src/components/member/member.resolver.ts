import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import * as mongoose from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';

@Resolver()
export class MemberResolver { 
    constructor(private readonly memberService: MemberService) {} //resolver ichida unga xizmat korsatadigan memberService modelni chaqirib oldik.Endi uni istalgan resolver ichida url api sifatida ishlata olamiz

    @Mutation(() => Member) //Mutation Dekorator orqali API mantigini qurdik
    //@UsePipes(ValidationPipe) //ushbu integratsiya orqali pipe validationning method darajasidagi qonuniyatini integratsiya qilamiz.Agar bu qatorni klassdan tashqarisiga yozsak resolver darajadagi integratsiya bolar edi
    public async signup(@Args("input") input: MemberInput ): Promise<Member> {
        console.log("Mutation: signup");
        return this.memberService.signup(input);
    }

    @Mutation(() => Member) 
    public async login(@Args("input") input: LoginInput ): Promise<Member> {
        console.log("STEP-4")
        console.log("Mutation: login");
        return await this.memberService.login(input);
        
    }


    @UseGuards(AuthGuard)
    @Query(() => String) 
    public async checkAuth(@AuthMember("memberNick") memberNick: string): Promise<string> {
        console.log("Mutation: checkAuth");
        console.log(memberNick)
        return `${memberNick}`;
    }

    @Roles(MemberType.USER, MemberType.AGENT) 
    @UseGuards(RolesGuard)
    @Query(() => String) 
    public async checkAuthRoles(@AuthMember("") authmember: Member): Promise<string> {
        console.log("Mutation: checkAuthRoles");
       
        return `Hi ${authmember.memberNick}, you are ${authmember.memberType}, ${authmember._id}`;
    }

    //Authentificated
    @UseGuards(AuthGuard)
    @Mutation(() => Member) 
    public async updateMember(@Args("input") input: MemberUpdate, @AuthMember("_id") memberId: mongoose.ObjectId): Promise<Member> {
        console.log("Mutation: updateMember");
        delete input._id; //input ichida kelgan memberid kerak emas sababi uni @AuthMember("_id") shu orqali qolga allaqachon kiritganmiz
        return this.memberService.updateMember(memberId, input);
    }

 

    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("Mutation: getMember");
        return this.memberService.getMember();
    }
    
    /* ADMIN */

    //Authorization: ADMIN
    @Roles(MemberType.ADMIN) //ozimiz hosil qilgan customize Roles decoratorni call qilib unga Admin typeni path qildik
    @UseGuards(RolesGuard)
    @Mutation(() => String)
    public async getAllMembersByAdmin(): Promise<string> {
        return this.memberService.getAllMembersByAdmin();
    }

    //Authorization: ADMIN
    @Mutation(() => String) 
    public async updateMemberbyAdmin(): Promise<string> {
        console.log("Mutation: updateMember");
        return this.memberService.updateMemberbyAdmin();
    }
}
