import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubService, GitHubUser } from '../services/github.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  username = '';
  loading = false;
  error = '';

  constructor(
    private githubService: GithubService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.username.trim()) {
      this.error = 'Please enter a username';
      return;
    }

    this.loading = true;
    this.error = '';

    this.githubService.getUser(this.username)
      .subscribe({
        next: (user: GitHubUser) => {
          this.loading = false;
          this.router.navigate(['/user', user.login]);
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 404) {
            this.error = 'User not found';
          } else {
            this.error = 'An error occurred while searching for the user';
          }
        }
      });
  }
}
