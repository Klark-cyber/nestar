import { Field, InputType } from "@nestjs/graphql";
import {IsNotEmpty, IsOptional, Length} from "class-validator"
import { MemberAuthType, MemberType } from "../../enums/member.enum";

// Frontend => Backend input types @InputType() orqali hosil qilinadi

@InputType() 
export class MemberInput { //kirib keladigan malumotlarni tekshirish uchun type
    @IsNotEmpty() //ushbu malumotni kiritish shart
    @Length(3, 12)
    @Field(() => String)
    memberNick: string;

     @IsNotEmpty()
    @Length(5, 12)
    @Field(() => String)
    memberPassword: string;
    
    @IsNotEmpty() 
    @Field(() => String)
    memberPhone: string;

    @IsOptional()
    @Field(() => MemberType, {nullable: true}) //nullable:true optional ekanligini anglatadi
    memberType?: MemberType;
    

    @IsOptional() //bu malumot optional
    @Field(() => MemberAuthType, {nullable: true}) //nullable:true optional ekanligini anglatadi
    memberAuthType?: MemberAuthType;
    
    
}

@InputType()
export class LoginInput { //kirib keladigan malumotlarni tekshirish uchun type
    @IsNotEmpty() //ushbu malumotni kiritish shart
    @Length(3, 12)
    @Field(() => String)
    memberNick: string;

     @IsNotEmpty()
    @Length(5, 12)
    @Field(() => String)
    memberPassword: string;
    
}
