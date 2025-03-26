import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RepositoryListComponent } from '../repository-list/repository-list.component';
import { GithubService, GitHubUser, GitHubRepo } from '../services/github.service';

/**
 * Component for displaying GitHub user details and their repositories
 * 
 * @remarks
 * This component fetches and displays:
 * - User profile information
 * - List of user's repositories
 * 
 * @public
 */
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RepositoryListComponent
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  /** 
   * GitHub username from route parameter 
   * @public
   */
  username: string | null = null;

  /** 
   * User details fetched from GitHub API 
   * @public
   */
  user: GitHubUser | null = null;

  /** 
   * List of repositories for the user 
   * @public
   */
  repos: GitHubRepo[] = [];

  /** 
   * Total number of repositories 
   * @public
   */
  reposCount: number = 0;

  /** 
   * Loading state for async operations 
   * @public
   */
  loading = true;

  /** 
   * Error message for failed operations 
   * @public
   */
  error = '';

  /**
   * Constructor with dependency injection
   * 
   * @param route - Angular route service for accessing route parameters
   * @param githubService - Service for fetching GitHub user data
   * @public
   */
  constructor(
    private route: ActivatedRoute,
    private githubService: GithubService
  ) { }

  /**
   * Lifecycle hook to initialize component
   * 
   * @remarks
   * Retrieves username from route and fetches user details
   * 
   * @public
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      if (this.username) {
        this.getUserDetails(this.username);
      }
    });
  }

  /**
   * Fetches user details from GitHub API
   * 
   * @param username - GitHub username to fetch details for
   * @public
   */
  getUserDetails(username: string): void {
    this.loading = true;
    this.error = '';

    this.githubService.getUser(username)
      .subscribe({
        next: (user: GitHubUser) => {
          this.user = user;
          this.getRepos(username);
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to load user details.';
          console.error(err);
        }
      });
  }

  /**
   * Fetches user's repositories from GitHub API
   * 
   * @param username - GitHub username to fetch repositories for
   * @public
   */
  getRepos(username: string): void {
    this.githubService.getUserRepos(username)
      .subscribe({
        next: (repos: GitHubRepo[]) => {
          this.repos = repos;
          this.reposCount = repos.length;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to load repositories.';
          console.error(err);
        }
      });
  }
}
