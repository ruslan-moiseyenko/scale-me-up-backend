import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GithubModule } from './github/github.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 3600000, // 1 hour
      max: 100,
      isGlobal: true,
    }),
    GithubModule,
  ],
})
export class AppModule {}
