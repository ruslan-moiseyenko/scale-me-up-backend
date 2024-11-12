import { ApiProperty } from '@nestjs/swagger';

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
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  full_name: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty()
  html_url: string;

  @ApiProperty()
  stargazers_count: number;

  @ApiProperty()
  watchers_count: number;

  @ApiProperty()
  forks_count: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty({ required: false })
  language: string;

  @ApiProperty({ type: GithubOwnerDto })
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
