import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GithubService, GitHubUser, GitHubRepo } from '../services/github.service';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  username: string | null = null;
  user: GitHubUser | null = null;
  repos: GitHubRepo[] = [];
  originalRepos: GitHubRepo[] = [];
  reposCount: number = 0;
  loading = true;
  error = '';
  sortBy: keyof GitHubRepo = 'updated_at';
  sortOrder: 'asc' | 'desc' = 'desc';

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
          this.originalRepos = repos;
          this.reposCount = repos.length;
          this.repos = [...repos];
          this.sortRepos();
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to load repositories.';
          console.error(err);
        }
      });
  }

  sortRepos(): void {
    this.repos = [...this.originalRepos].sort((a, b) => {
      const valueA = a[this.sortBy];
      const valueB = b[this.sortBy];

      if (valueA === undefined || valueB === undefined) return 0;

      // Ordenação por data para o campo updated_at
      if (this.sortBy === 'updated_at') {
        const dateA = new Date(valueA as string).getTime();
        const dateB = new Date(valueB as string).getTime();
        return this.sortOrder === 'asc'
          ? dateA - dateB
          : dateB - dateA;
      }

      // Ordenação para strings
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      // Ordenação para números
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.sortOrder === 'asc'
          ? valueA - valueB
          : valueB - valueA;
      }

      return 0;
    });
  }
}
