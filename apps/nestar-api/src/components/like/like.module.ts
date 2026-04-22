import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from './like.service';

@Module({
    imports: [
    MongooseModule.forFeature([{ name: "Like", schema: LikeSchema }]),
    forwardRef(() => AuthModule), // <--- AuthModule shu yerda bo'lishi shart
    ViewModule,
  ],
    providers: [LikeService],
})
export class LikeModule {}
