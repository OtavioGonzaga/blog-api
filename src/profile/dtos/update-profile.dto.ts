import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	name?: string;
}
