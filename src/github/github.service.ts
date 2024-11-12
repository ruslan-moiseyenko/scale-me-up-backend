import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { GithubSearchResponse } from 'src/interfaces/github-repository.interface';
import { GithubSearchResponseDto } from 'src/github/dto/search-repositories.dto';

@Injectable()
export class GithubService {
  private readonly baseUrl = 'https://api.github.com';

  constructor(private readonly httpService: HttpService) {}

  async searchRepositories(
    params: GithubSearchResponseDto,
  ): Promise<GithubSearchResponse> {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<GithubSearchResponse>(`${this.baseUrl}/search/repositories`, {
            params,
            headers: {
              Accept: 'application/vnd.github.v3+json',
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
}
