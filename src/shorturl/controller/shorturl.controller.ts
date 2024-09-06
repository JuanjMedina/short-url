import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ShorturlService } from '../services/shorturl.service';
import { ShortUrlDto, UpdateShortUrlDto } from '../dto/shortUrl.dto';
import { Response, urlencoded } from 'express';

@Controller('shorturl')
export class ShorturlController {
  constructor(private readonly shortUrlService: ShorturlService) {}

  @Post('createShortUrl')
  createShortUrl(@Body() shortUrlDto: ShortUrlDto) {
    return this.shortUrlService.createShortUrl(shortUrlDto);
  }

  @Get('/allUrlss')
  async allUrls() {
    return await this.shortUrlService.allUrls();
  }

  @Get('/:urlEncoded')
  async searchUrl(
    @Param('urlEncoded') urlEncoded: string,
    @Res() res: Response,
  ) {
    const url = await this.shortUrlService.searchUrl(urlEncoded);
    if (url) {
      return res.redirect(url);
    } else {
      return res.status(404).send('URL not found');
    }
  }

  @Delete('/:urlEncodedId')
  async deleteUrlEncode(@Param('urlEncodedId') urlEncoded: string) {
    console.log(urlencoded);
    return await this.shortUrlService.deleteUrlEncoded(urlEncoded);
  }

  @Patch('/:urlEncodedId')
  async updateUrlEncoded(
    @Param('urlEncodedId') urlEncoded: string,
    @Body() updateShortUrlDto: UpdateShortUrlDto,
  ) {
    return this.shortUrlService.changeUrlEncoded(urlEncoded, updateShortUrlDto);
  }
}
