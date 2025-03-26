import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { GitHubUser } from '../interfaces/GitHubUser.interface';
import { GitHubRepo } from '../interfaces/GitHubRepo.interface';

/**
 * Service for interacting with GitHub API
 *
 * @remarks
 * Provides methods to fetch user and repository data
 *
 * @public
 */
@Injectable({
  providedIn: 'root'
})
export class GithubService {
  /** Base URL for GitHub API */
  private readonly apiUrl = 'https://api.github.com';

  /**
   * Constructor with dependency injection
   *
   * @param http - HttpClient for making HTTP requests
   * @public
   */
  constructor(private http: HttpClient) { }

  /**
   * Fetches a GitHub user's profile
   *
   * @param username - GitHub username to fetch
   * @returns Observable of GitHubUser
   * @public
   */
  getUser(username: string): Observable<GitHubUser> {
    return this.http.get<GitHubUser>(`${this.apiUrl}/users/${username}`);
  }

  /**
   * Fetches repositories for a given GitHub user
   *
   * @param username - GitHub username to fetch repositories for
   * @returns Observable of GitHubRepo array
   * @public
   */
  getUserRepos(username: string): Observable<GitHubRepo[]> {
    return this.http.get<GitHubRepo[]>(`${this.apiUrl}/users/${username}/repos`);
  }

  /**
   * Searches for GitHub users
   *
   * @param query - Search query for users
   * @returns Observable of GitHubUser array
   * @public
   */
  searchUsers(query: string): Observable<GitHubUser[]> {
    return this.http.get<{ items: GitHubUser[] }>(`${this.apiUrl}/search/users?q=${query}`)
      .pipe(map(response => response.items));
  }
}
