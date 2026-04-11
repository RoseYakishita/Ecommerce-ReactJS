import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  message: string;
}
