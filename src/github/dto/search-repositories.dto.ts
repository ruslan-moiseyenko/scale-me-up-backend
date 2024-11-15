import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GithubOwnerDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  avatar_url: string;

  @ApiProperty()
  html_url: string;
}

export class GithubRepositoryDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  full_name: string;

  @ApiProperty({ required: false })
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  html_url: string;

  @ApiProperty()
  @IsNumber()
  stargazers_count: number;

  @ApiProperty()
  @IsNumber()
  watchers_count: number;

  @ApiProperty()
  @IsNumber()
  forks_count: number;

  @ApiProperty()
  @IsString()
  created_at: string;

  @ApiProperty()
  @IsString()
  updated_at: string;

  @ApiProperty({ required: false })
  @IsString()
  language: string;

  @ApiProperty({ type: GithubOwnerDto })
  @IsString()
  owner: GithubOwnerDto;
}

export class GithubSearchResponseDto {
  @ApiProperty()
  total_count: number;

  @ApiProperty()
  incomplete_results: boolean;

  @ApiProperty({ type: [GithubRepositoryDto] })
  items: GithubRepositoryDto[];
}

export class SearchRepositoriesDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({
    required: false,
    enum: ['stars', 'forks', 'updated'],
  })
  @IsOptional()
  @IsIn(['stars', 'forks', 'updated'])
  sort?: 'stars' | 'forks' | 'updated';

  @ApiProperty({
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @ApiProperty({
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  per_page?: number;
}
