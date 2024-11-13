import {
  Injectable,
  Inject,
  HttpException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { GithubSearchResponse } from 'src/interfaces/github-repository.interface';
import { GithubSearchResponseDto } from 'src/github/dto/search-repositories.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class GithubService {
  private readonly baseUrl = 'https://api.github.com';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: any,
  ) {}

  private generateStarredKey(
    owner: string,
    repo: string,
    token: string,
  ): string {
    return `starred:${token}:${owner}/${repo}`;
  }
  async searchRepositories(
    params: GithubSearchResponseDto,
  ): Promise<GithubSearchResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<GithubSearchResponse>(`${this.baseUrl}/search/repositories`, {
            params,
            headers: {
              Accept: 'application/vnd.github+json',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response?.status === 422) {
                throw new HttpException(
                  'Invalid search query parameters',
                  HttpStatus.UNPROCESSABLE_ENTITY,
                );
              }
              if (error.response?.status === 403) {
                throw new HttpException(
                  'API rate limit exceeded',
                  HttpStatus.TOO_MANY_REQUESTS,
                );
              }
              throw new HttpException(
                'Failed to fetch repositories',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );

      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isRepositoryStarred(
    owner: string,
    repo: string,
    token: string,
  ): Promise<boolean> {
    const cacheKey = this.generateStarredKey(owner, repo, token);

    // check cache first
    const cachedValue = await this.cacheManager.get(cacheKey);
    if (cachedValue !== null && cachedValue !== undefined) {
      return cachedValue;
    }

    try {
      await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/user/starred/${owner}/${repo}`, {
          headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      // cache the result
      await this.cacheManager.set(cacheKey, true);
      return true;
    } catch (error) {
      if (error.response?.status === 404) {
        await this.cacheManager.set(cacheKey, false);
        return false;
      }
      if (error.response?.status === 401) {
        throw new UnauthorizedException('Invalid GitHub token');
      }
      throw new HttpException(
        'Failed to check star status',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async starRepository(
    owner: string,
    repo: string,
    token: string,
  ): Promise<void> {
    const isStarred = await this.isRepositoryStarred(owner, repo, token);

    if (isStarred) {
      throw new HttpException(
        'Repository is already starred',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      console.log(`Attempting to star repository ${owner}/${repo}`);
      console.log('Using token:', token.slice(0, 4) + '...' + token.slice(-4));

      await firstValueFrom(
        this.httpService
          .put(
            `${this.baseUrl}/user/starred/${owner}/${repo}`,
            {},
            {
              headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              console.log('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
              });

              if (error.response?.status === 401) {
                throw new UnauthorizedException('Invalid GitHub token');
              }
              if (error.response?.status === 404) {
                throw new HttpException(
                  'Repository not found',
                  HttpStatus.NOT_FOUND,
                );
              }
              throw new HttpException(
                'Failed to star repository',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async unstarRepository(
    owner: string,
    repo: string,
    token: string,
  ): Promise<void> {
    const isStarred = await this.isRepositoryStarred(owner, repo, token);

    if (!isStarred) {
      throw new HttpException(
        'Repository is not starred',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await firstValueFrom(
        this.httpService
          .delete(`${this.baseUrl}/user/starred/${owner}/${repo}`, {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: `Bearer ${token}`,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response?.status === 401) {
                throw new UnauthorizedException('Invalid GitHub token');
              }
              if (error.response?.status === 404) {
                throw new HttpException(
                  'Repository not found',
                  HttpStatus.NOT_FOUND,
                );
              }
              throw new HttpException(
                'Failed to unstar repository',
                HttpStatus.BAD_GATEWAY,
              );
            }),
          ),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
