import { registerEnumType } from '@nestjs/graphql'; //pasdagi enumlarni graphqlda togridan togri ishlatib bolmaydi shu sababli ushbu packagedan foydalanib enumlarni royxatdan otqazamiz

export enum MemberType {
  USER = 'USER',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
}

registerEnumType(MemberType, {
  name: 'MemberType',
});

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  BLOCK = 'BLOCK',
  DELETE = 'DELETE',
}

registerEnumType(MemberStatus, {
  name: 'MemberStatus',
});

export enum MemberAuthType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  TELEGRAM = 'TELEGRAM',
}

registerEnumType(MemberAuthType, {
  name: 'MemberAuthType',
});