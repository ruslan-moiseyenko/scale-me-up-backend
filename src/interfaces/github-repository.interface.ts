export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  language: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

export interface GithubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GithubRepository[];
}
