export interface GithubSearchParams {
  q?: string;
  sort?: 'stars' | 'forks' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  isStarred: boolean;
}
