// src/github/github.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';
// import { SearchRepositoriesDto } from './dto/search-repositories.dto';
// import { GithubSearchResponseDto } from './dto/github-repository.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GithubSearchResponseDto } from 'src/github/dto/search-repositories.dto';

@Controller('github')
@ApiTags('GitHub')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repositories')
  @ApiOperation({ summary: 'Search GitHub repositories' })
  @ApiResponse({
    status: 200,
    description: 'Returns GitHub repositories based on search criteria',
    type: GithubSearchResponseDto,
  })
  @ApiResponse({ status: 422, description: 'Invalid search query parameters' })
  @ApiResponse({ status: 403, description: 'API rate limit exceeded' })
  async searchRepositories(
    @Query() searchParams: GithubSearchResponseDto,
  ): Promise<GithubSearchResponseDto> {
    return this.githubService.searchRepositories(searchParams);
  }
}
