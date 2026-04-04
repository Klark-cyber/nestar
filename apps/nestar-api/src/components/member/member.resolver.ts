import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';

@Resolver()
export class MemberResolver { 
    constructor(private readonly memberService: MemberService) {} //resolver ichida unga xizmat korsatadigan memberService modelni chaqirib oldik.Endi uni istalgan resolver ichida url api sifatida ishlata olamiz

    @Mutation(() => String) //Mutation Dekorator orqali API mantigini qurdik
    @UsePipes(ValidationPipe) //ushbu integratsiya orqali pipe validationning method darajasidagi qonuniyatini integratsiya qilamiz.Agar bu qatorni klassdan tashqarisiga yozsak resolver darajadagi integratsiya bolar edi
    public async signup(@Args("input") input: MemberInput ): Promise<string> {
        console.log("Mutation: signup");
        console.log("input:", input);
        return this.memberService.signup();
    }

    @Mutation(() => String) 
    @UsePipes(ValidationPipe) //ushbu integratsiya orqali pipe validationning method darajasidagi qonuniyatini integratsiya qilamiz.Agar bu qatorni klassdan tashqarisiga yozsak resolver darajadagi integratsiya bolar edi
    public async login(@Args("input") input: LoginInput ): Promise<string> {
        console.log("Mutation: login");
        return this.memberService.login();
    }

    @Mutation(() => String) 
    public async updateMember(): Promise<string> {
        console.log("Mutation: updateMember");
        return this.memberService.updateMember();
    }

    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("Mutation: getMember");
        return this.memberService.getMember();
    }
    
}
