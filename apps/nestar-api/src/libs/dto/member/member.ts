import { Field, Int, ObjectType } from "@nestjs/graphql";
import * as mongoose from "mongoose";
import { MemberAuthType, MemberStatus, MemberType } from "../../enums/member.enum";





// Backend => Frontend types @ObjectType() orqali hosil qilinadi
@ObjectType()
export class Member{
    @Field(() => String) //Field bu return boladigan resultni typeni tekshirib beradi
    _id: mongoose.Types.ObjectId;

    @Field(() => MemberType)
    memberType: MemberType;

    @Field(() => MemberStatus)
    memberStatus: MemberStatus;

    @Field(() => MemberAuthType)
    memberAuthType: MemberAuthType;

    @Field(() => String)
    memberPhone: string;

    @Field(() => String)
    memberNick: string;

    memberPassword?: string; //Field yozilmaganiga sabab password tashqi olamga ochiqlanmaydi
    
    @Field(() => String, {nullable: true}) //memberFullName optional boladi
    memberFullName?: string;
    
    @Field(() => String) 
    memberImage: string;

     @Field(() => String, {nullable: true}) 
    memberAddress?: string;

     @Field(() => String, {nullable: true}) 
    memberDesc?: string;

    @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberProperties?: number;

     @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberArticles?: number;

    @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberFollowers?: number;

     @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberFollowings?: number;

     @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberPoints?: number;

     @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberLikes?: number;

     @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberViews?: number;

     @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberComments?: number;

     @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberRank?: number;

     @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberWarnings?: number;

    @Field(() => Int, {nullable: true})  //Int graphqlga tegishli typing
    memberBlocks?: number;

     @Field(() => Date, {nullable: true}) 
    deletedAt?: Date;

    @Field(() => Date ) 
    createdAt: Date; 

    @Field(() => Date ) 
    updatedAt: Date;
}