import { IsString, IsUrl } from 'class-validator';
export class ShortUrlDto {
  @IsUrl()
  URL: string;
}

export class ShortUrlPersonalizeDto {
  @IsString()
  URL: string;

  @IsString()
  name: string;
}

export class UpdateShortUrlDto {
  @IsString()
  url: string;
}
