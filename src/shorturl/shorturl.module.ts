import { Module } from '@nestjs/common';
import { ShorturlService } from './services/shorturl.service';
import { ShorturlController } from './controller/shorturl.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortUrl, ShortUrlSchema } from './model/shortUrl.model';
import { CounterurlModule } from '@/counterurl/counterurl.module';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ShortUrl.name,
        schema: ShortUrlSchema,
      },
    ]),
    CounterurlModule,
    UserModule,
  ],
  providers: [ShorturlService],
  controllers: [ShorturlController],
})
export class ShorturlModule {}
