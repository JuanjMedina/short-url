import { Module } from '@nestjs/common';
import { CounterurlController } from './controller/counterurl.controller';
import { CounterurlService } from './service/counterurl.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterUrl, CounterUrlSchema } from './model/counterurl.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CounterUrl.name,
        schema: CounterUrlSchema,
      },
    ]),
  ],
  controllers: [CounterurlController],
  providers: [CounterurlService],
  exports: [CounterurlService],
})
export class CounterurlModule {}
