import { Injectable } from '@nestjs/common';
import {
  ShortUrlDto,
  ShortUrlPersonalizeDto,
  UpdateShortUrlDto,
} from '../dto/shortUrl.dto';
import { convertBase10ToBase62 } from '@/utils/utils';
import { InjectModel } from '@nestjs/mongoose';
import { ShortUrl, ShortUrlDocument } from '../model/shortUrl.model';
import { Model } from 'mongoose';
import { CounterurlService } from '@/counterurl/service/counterurl.service';
import { ErrorManager } from '@/utils/error.manager';
import { $URL_SHORT } from '@/constants/url.constant';
import { UsersService } from '@/user/service/user.service';

@Injectable()
export class ShorturlService {
  constructor(
    @InjectModel(ShortUrl.name) private shortUrlModel: Model<ShortUrlDocument>,
    private readonly counterUrlService: CounterurlService,
    private readonly userService: UsersService,
  ) {}

  async searchShortUrl(shortUrl: string): Promise<ShortUrl> {
    return await this.shortUrlModel.findOne({
      shortUrl,
    });
  }

  async createShortUrl(shortUrlDto: ShortUrlDto): Promise<{
    shortUrl: string;
    url: string;
  }> {
    try {
      const { URL } = shortUrlDto;
      const { sequence_value } = await this.counterUrlService.getNextUrl();

      let shortUrl: string;
      shortUrl = convertBase10ToBase62(sequence_value);

      const responseShortUrl = await this.searchShortUrl(shortUrl);

      if (responseShortUrl) {
        const { sequence_value } = await this.counterUrlService.getNextUrl();
        shortUrl = convertBase10ToBase62(sequence_value);
      }

      const createdShortUrl = new this.shortUrlModel({
        url: URL,
        shortUrl: shortUrl,
      });

      const responseCreatedUrl = await createdShortUrl.save();
      const { url } = responseCreatedUrl;
      const responseObject = {
        shortUrl: $URL_SHORT.concat(`${shortUrl}`),
        url,
      };
      return responseObject;
    } catch (Err) {}
  }

  async createPersonalizeUrl(
    idUser: string,
    roleUser: string,
    body: ShortUrlPersonalizeDto,
  ): Promise<ShortUrl> {
    try {
      const { URL, name } = body;
      const { sequence_value } = await this.counterUrlService.getNextUrl();

      //TODO : Verificar si el usuario existe !
      const user = await this.userService.findUserById(idUser);

      if (!user) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'Invalid User ',
        });
      }
      let shortUrl = name;
      const hashString = convertBase10ToBase62(sequence_value);
      shortUrl += hashString;

      const responseShortUrl = await this.searchShortUrl(shortUrl);

      if (responseShortUrl) {
        const { sequence_value } = await this.counterUrlService.getNextUrl();
        shortUrl = convertBase10ToBase62(sequence_value);
      }
      const createdShortUrl = new this.shortUrlModel({
        url: URL,
        shortUrl: shortUrl,
        user: idUser,
      }).save();

      return createdShortUrl;
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }

  async allUrls(): Promise<ShortUrl[]> {
    try {
      return await this.shortUrlModel.find();
    } catch (Err) {}
  }

  async searchUrl(urlEncoded: string) {
    try {
      const foundUrl = await this.shortUrlModel.findOne({
        shortUrl: urlEncoded,
      });

      if (!foundUrl || !foundUrl.shortUrl) {
        throw new ErrorManager({
          type: 'NOT_FOUND',
          message: 'Url not found ',
        });
      }

      const { url } = foundUrl;
      return url;
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }

  async deleteUrlEncoded(urlEncoded: string): Promise<string> {
    try {
      const deletedUrl = await this.shortUrlModel.findOneAndDelete({
        shortUrl: urlEncoded,
      });
      if (!deletedUrl) {
        throw new ErrorManager({
          message: 'UrlEncoded not found! ',
          type: 'NOT_FOUND',
        });
      }
      return 'Url deleted Sucefully !';
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }

  async changeUrlEncoded(
    urlEncoded: string,
    updateShortUrlDto: UpdateShortUrlDto,
  ): Promise<ShortUrl> {
    try {
      const responseUrl = await this.shortUrlModel.findOne({
        shortUrl: urlEncoded,
      });

      if (!responseUrl) {
        throw new ErrorManager({
          message: 'Url encoded not found!',
          type: 'FORBIDDEN',
        });
      }

      const responseUrlEncoded = await this.shortUrlModel.findOneAndUpdate(
        { shortUrl: urlEncoded },
        { url: updateShortUrlDto.url },
        { new: true },
      );

      return responseUrlEncoded;
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }
}
