import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RepositoryListComponent } from '../repository-list/repository-list.component';
import { GithubService, GitHubUser, GitHubRepo } from '../services/github.service';

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
  username: string | null = null;
  user: GitHubUser | null = null;
  repos: GitHubRepo[] = [];
  reposCount: number = 0;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private githubService: GithubService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username');
      if (this.username) {
        this.getUserDetails(this.username);
      }
    });
  }

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
