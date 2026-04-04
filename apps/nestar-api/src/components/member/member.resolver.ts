import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';

@Resolver()
export class MemberResolver { 
    constructor(private readonly memberService: MemberService) {} //resolver ichida unga xizmat korsatadigan memberService modelni chaqirib oldik.Endi uni istalgan resolver ichida url api sifatida ishlata olamiz

    @Mutation(() => String) //Mutation Dekorator orqali API mantigini qurdik
    public async signup(): Promise<string> {
        console.log("Mutation: signup");
        return this.memberService.signup();
    }

    @Mutation(() => String) 
    public async login(): Promise<string> {
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
