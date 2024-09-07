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
import { Request, Response } from 'express';
import { AuthGuard } from '@/auth/guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('ShortUrl')
@Controller('shorturl')
export class ShorturlController {
  constructor(private readonly shortUrlService: ShorturlService) {}

  @Post('createShortUrl')
  @ApiOperation({ summary: 'Create a new short URL' })
  @ApiBody({
    type: ShortUrlDto,
    description: 'Details of the short URL to be created',
  })
  @ApiResponse({
    status: 201,
    description: 'Short URL created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid data provided',
  })
  createShortUrl(@Body() shortUrlDto: ShortUrlDto) {
    return this.shortUrlService.createShortUrl(shortUrlDto);
  }

  @UseGuards(AuthGuard)
  @Post('createShortUrlPersonalize')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a personalized short URL' })
  @ApiBody({
    type: ShortUrlPersonalizeDto,
    description: 'Details of the personalized short URL to be created',
  })
  @ApiResponse({
    status: 201,
    description: 'Personalized short URL created successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Authentication required',
  })
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

  @Get('allUrls')
  @ApiOperation({ summary: 'Retrieve all short URLs' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all short URLs',
    schema: {
      example: [
        { urlEncoded: 'abc123', originalUrl: 'http://example.com' },
        { urlEncoded: 'xyz456', originalUrl: 'http://another-example.com' },
      ],
    },
  })
  async allUrls() {
    return await this.shortUrlService.allUrls();
  }

  @Get('/:urlEncoded')
  @ApiOperation({
    summary: 'Redirect to the original URL based on the short URL',
  })
  @ApiParam({
    name: 'urlEncoded',
    description: 'Encoded short URL',
    type: String,
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to the original URL',
  })
  @ApiResponse({
    status: 404,
    description: 'URL not found',
  })
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
  @ApiOperation({ summary: 'Delete a short URL' })
  @ApiParam({
    name: 'urlEncodedId',
    description: 'Encoded short URL ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Short URL deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async deleteUrlEncode(@Param('urlEncodedId') urlEncoded: string) {
    return await this.shortUrlService.deleteUrlEncoded(urlEncoded);
  }

  @Patch('/:urlEncodedId')
  @ApiOperation({ summary: 'Update a short URL' })
  @ApiParam({
    name: 'urlEncodedId',
    description: 'Encoded short URL ID',
    type: String,
  })
  @ApiBody({
    type: UpdateShortUrlDto,
    description: 'Updated details of the short URL',
  })
  @ApiResponse({
    status: 200,
    description: 'Short URL updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Short URL not found',
  })
  async updateUrlEncoded(
    @Param('urlEncodedId') urlEncoded: string,
    @Body() updateShortUrlDto: UpdateShortUrlDto,
  ) {
    return this.shortUrlService.changeUrlEncoded(urlEncoded, updateShortUrlDto);
  }
}
