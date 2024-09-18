import { Injectable } from '@nestjs/common';
import {
  ShortUrlDto,
  ShortUrlPersonalizeDto,
  UpdateShortUrlDto,
} from '../dto/shortUrl.dto';
import { convertBase10ToBase62 } from '../../utils/utils';
import { InjectModel } from '@nestjs/mongoose';
import { ShortUrl, ShortUrlDocument } from '../model/shortUrl.model';
import { Model } from 'mongoose';
import { CounterurlService } from '../../counterurl/service/counterurl.service';
import { ErrorManager } from '../../utils/error.manager';
import { $URL_SHORT } from '../../constants/url.constant';
import { UsersService } from '../../user/service/user.service';

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
      console.log(`secuence_value ${sequence_value}`);

      let shortUrl;
      shortUrl = convertBase10ToBase62(sequence_value);

      const responseShortUrl = await this.searchShortUrl(shortUrl);

      if (responseShortUrl) {
        const { sequence_value } = await this.counterUrlService.getNextUrl();
        shortUrl = convertBase10ToBase62(sequence_value);
      }

      const createdShortUrl = await this.shortUrlModel.create({
        url: URL,
        shortUrl: shortUrl,
      });

      const { url } = createdShortUrl;
      return { url, shortUrl };
    } catch (Err) {}
  }

  async createPersonalizeUrl(
    idUser: string,
    roleUser: string,
    body: ShortUrlPersonalizeDto,
  ): Promise<Omit<ShortUrl, 'user'>> {
    try {
      const { URL, name } = body;
      const { sequence_value } = await this.counterUrlService.getNextUrl();

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
      const createdShortUrl = await this.shortUrlModel.create({
        url: URL,
        shortUrl,
        user: idUser,
      });
      const objectResponse = createdShortUrl.toObject();
      delete objectResponse.user;
      return objectResponse;
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
      console.log(Err);
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

  async getShortUrlsByUser(idUser: string) {
    try {
      const shortUrlUser = await this.shortUrlModel
        .find({
          user: idUser,
        })
        .select('-user');
      if (!shortUrlUser || shortUrlUser.length < 0) {
        throw new ErrorManager({
          message: 'Invalid credentials ',
          type: 'BAD_REQUEST',
        });
      }
      return shortUrlUser;
    } catch (Err) {
      throw ErrorManager.createSignatureError(Err.message);
    }
  }
}
