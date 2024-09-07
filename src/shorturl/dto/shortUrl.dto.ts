import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';
export class ShortUrlDto {
  @IsUrl()
  @ApiProperty({
    example: 'http://accenture.com',
  })
  URL: string;
}

export class ShortUrlPersonalizeDto {
  @ApiProperty({
    example: 'http://accenture.com',
  })
  @IsString()
  URL: string;

  @ApiProperty({
    example: 'Juan',
  })
  @IsString()
  name: string;
}

export class UpdateShortUrlDto {
  @ApiPropertyOptional({
    example: 'http://youtube.com',
  })
  @IsString()
  url: string;
}
