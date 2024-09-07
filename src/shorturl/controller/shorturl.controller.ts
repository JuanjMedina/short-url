import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ShorturlService } from '../services/shorturl.service';
import {
  ShortUrlDto,
  ShortUrlPersonalizeDto,
  UpdateShortUrlDto,
} from '../dto/shortUrl.dto';
import { Request, Response, urlencoded } from 'express';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ShortUrl')
@Controller('shorturl')
export class ShorturlController {
  constructor(private readonly shortUrlService: ShorturlService) {}

  @Post('createShortUrl')
  createShortUrl(@Body() shortUrlDto: ShortUrlDto) {
    return this.shortUrlService.createShortUrl(shortUrlDto);
  }

  @UseGuards(AuthGuard)
  @Post('createShortUrlPersonalize')
  createPersonalizeUrl(
    @Req() req: Request,
    @Body() body: ShortUrlPersonalizeDto,
  ) {
    const { idUser, roleUser } = req;
    const response = this.shortUrlService.createPersonalizeUrl(
      idUser,
      roleUser,
      body,
    );
    return response;
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
