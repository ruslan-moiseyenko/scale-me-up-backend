import {
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Put,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { GithubService } from './github.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiHeader,
  ApiParam,
} from '@nestjs/swagger';
import { GithubSearchResponseDto } from 'src/github/dto/search-repositories.dto';

@Controller('github')
@ApiTags('GitHub')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('repositories')
  @ApiOperation({ summary: 'Search GitHub public repositories' })
  @ApiResponse({
    status: 200,
    description: 'Returns GitHub repositories based on search criteria',
    type: GithubSearchResponseDto,
  })
  @ApiResponse({ status: 422, description: 'Invalid search query parameters' })
  @ApiResponse({ status: 403, description: 'API rate limit exceeded' })
  async searchRepositories(
    @Query() searchParams: GithubSearchResponseDto,
    @Headers('authorization') authHeader?: string,
  ): Promise<GithubSearchResponseDto> {
    const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
    return this.githubService.searchRepositories(searchParams, token);
  }

  @Get('repositories/:owner/:repo/starred')
  @ApiOperation({
    summary: 'Check if a repository is starred by the authenticated user',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'GitHub personal access token',
    required: true,
  })
  @ApiParam({ name: 'owner', description: 'Repository owner' })
  @ApiParam({ name: 'repo', description: 'Repository name' })
  @ApiResponse({
    status: 200,
    description:
      'Returns boolean: true if repository is starred, false otherwise',
  })
  @ApiResponse({ status: 401, description: 'Invalid GitHub token' })
  async isRepositoryStarred(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<{ isStarred: boolean }> {
    if (!authHeader) {
      throw new UnauthorizedException('GitHub token is required');
    }

    const token = authHeader.replace('Bearer ', '');
    const isStarred = await this.githubService.isRepositoryStarred(
      owner,
      repo,
      token,
    );
    return { isStarred };
  }

  @Put('repositories/:owner/:repo/star')
  @ApiOperation({ summary: 'Star a GitHub repository' })
  @ApiHeader({
    name: 'Authorization',
    description: 'GitHub personal access token',
    required: true,
  })
  @ApiParam({ name: 'owner', description: 'Repository owner' })
  @ApiParam({ name: 'repo', description: 'Repository name' })
  @ApiResponse({ status: 204, description: 'Repository starred successfully' })
  @ApiResponse({ status: 401, description: 'Invalid GitHub token' })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  async starRepository(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<void> {
    if (!authHeader) {
      throw new UnauthorizedException('GitHub token is required');
    }

    const token = authHeader.replace('Bearer ', '');
    await this.githubService.starRepository(owner, repo, token);
  }

  @Delete('repositories/:owner/:repo/star')
  @ApiOperation({ summary: 'Unstar a GitHub repository' })
  @ApiHeader({
    name: 'Authorization',
    description: 'GitHub personal access token',
    required: true,
  })
  @ApiParam({ name: 'owner', description: 'Repository owner' })
  @ApiParam({ name: 'repo', description: 'Repository name' })
  @ApiResponse({
    status: 204,
    description: 'Repository unstarred successfully',
  })
  @ApiResponse({ status: 401, description: 'Invalid GitHub token' })
  @ApiResponse({ status: 404, description: 'Repository not found' })
  async unstarRepository(
    @Param('owner') owner: string,
    @Param('repo') repo: string,
    @Headers('authorization') authHeader?: string,
  ): Promise<void> {
    if (!authHeader) {
      throw new UnauthorizedException('GitHub token is required');
    }

    const token = authHeader.replace('Bearer ', '');
    await this.githubService.unstarRepository(owner, repo, token);
  }
}
