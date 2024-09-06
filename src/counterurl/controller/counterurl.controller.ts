import { Controller, Get } from '@nestjs/common';
import { CounterurlService } from '../service/counterurl.service';

@Controller('counterurl')
export class CounterurlController {
  constructor(private readonly counterUrlService: CounterurlService) {}
  @Get('update')
  update() {
    return this.counterUrlService.getNextUrl();
  }
}
