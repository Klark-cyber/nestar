import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import * as mongoose from 'mongoose';
import * as mongoose_1 from 'mongoose';

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

    //Authentificated
    @UseGuards(AuthGuard)
    @Mutation(() => String) 
    public async updateMember(@AuthMember("_id") memberId: mongoose.ObjectId): Promise<string> {
        console.log("Mutation: updateMember");
        console.log(memberId)
        return this.memberService.updateMember();
    }

     @UseGuards(AuthGuard)
    @Query(() => String) 
    public async checkAuth(@AuthMember("memberNick") memberNick: string): Promise<string> {
        console.log("Mutation: checkAuth");
        console.log(memberNick)
        return `${memberNick}`;
    }

    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("Mutation: getMember");
        return this.memberService.getMember();
    }
    
    /* ADMIN */

    //Authorization: ADMIN
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
