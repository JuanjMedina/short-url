import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ShorturlModule } from './shorturl/shorturl.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterurlModule } from './counterurl/counterurl.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

const $ENVIRONMENT = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${$ENVIRONMENT}.env`,
    }),
    MongooseModule.forRoot(`${process.env.MONGODB_URI}`),
    ShorturlModule,
    CounterurlModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
