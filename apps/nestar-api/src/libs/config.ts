import {ObjectId} from "bson"

export const availableAgentSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews", "memberRank"]; //user agentlarni sort qiladi
export const availableMemberSorts = ["createdAt", "updatedAt", "memberLikes", "memberViews"]; //admin jami userlarni sort qiladi
export const shapeIntoMongoObjectId = (target:any) => {
    return typeof target === "string" ? new ObjectId(target) : target;
}