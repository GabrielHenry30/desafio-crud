import { IsString, IsEmail, Matches, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { CustomerStatusEnum } from '@prisma/client';

export class CreateUpdateCustomerDto {
  @IsString({ message: 'name must be a string' })
  @IsNotEmpty({ message: 'name is required' })
  name!: string;

  @IsEmail({}, { message: 'email is invalid' })
  @IsNotEmpty({ message: 'email is required' })
  email!: string;

  @IsString({ message: 'document must be a string' })
  @IsNotEmpty({ message: 'document is required' })
  @Transform(({ value }) => {
    return value && typeof value === 'string' ? value.replace(/\D/g, '') : value;
  })
  @Matches(/^\d{11,14}$/, {
    message: 'document is invalid. Must contain between 11 and 14 digits',
  })
  document!: string;

  @IsOptional()
  @IsEnum(CustomerStatusEnum, {
    message: 'status must be one of: ACTIVE, INACTIVE, BLOCKED',
  })
  status?: CustomerStatusEnum;
}
