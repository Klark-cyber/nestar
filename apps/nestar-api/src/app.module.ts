import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config"; //.env ichidagilarni import qilish imkonini beruvchi package
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo"
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [ConfigModule.forRoot(), 
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,

    }), ComponentsModule, //components moduleda member, property va h.k modullerni tashkillashtiramiz.ularni components module umumlasjtiradi.components ni esa asosiy app.modulega import qilib oldik
        DatabaseModule], //Databasega ulanish mantigi yozilgan module.Uni alohida tashkillashtirdik sababi loyiha ishga tushganda databasega connect 1 marta amalga oshadi va yakunlanadi
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
