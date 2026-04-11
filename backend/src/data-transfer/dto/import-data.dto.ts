import { IsBoolean, IsOptional } from 'class-validator';

export class ImportDataDto {
  data: any;

  @IsOptional()
  @IsBoolean()
  replaceExisting?: boolean;
}
