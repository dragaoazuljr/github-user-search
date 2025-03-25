import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface GitHubUser {
  login: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  avatar_url: string;
  location: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stargazers_count: number;
  html_url: string;
  language: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private readonly apiUrl = 'https://api.github.com';

  constructor(private http: HttpClient) { }

  getUser(username: string): Observable<GitHubUser> {
    return this.http.get<GitHubUser>(`${this.apiUrl}/users/${username}`);
  }

  getUserRepos(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(`${this.apiUrl}/users/${username}/repos`);
  }

  searchUsers(query: string): Observable<GitHubUser[]> {
    return this.http.get<{items: GitHubUser[]}>(`${this.apiUrl}/search/users?q=${query}`)
      .pipe(map(response => response.items));
  }
}
