import { IsNumber, IsOptional } from 'class-validator';

export class PaginatorDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
