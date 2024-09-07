import { Controller, Get } from '@nestjs/common';
import { CounterurlService } from '../service/counterurl.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('counterurl')
export class CounterurlController {
  constructor(private readonly counterUrlService: CounterurlService) {}
  @ApiExcludeEndpoint()
  @Get('update')
  update() {
    return this.counterUrlService.getNextUrl();
  }
}
