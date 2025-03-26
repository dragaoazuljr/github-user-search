import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubService } from '../services/github.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { GitHubUser } from '../interfaces/GitHubUser.interface';

/**
 * Component for searching GitHub users
 *
 * @remarks
 * This component provides functionality to:
 * - Search for a GitHub user by username
 * - Validate username input
 * - Navigate to user details page
 *
 * @public
 */
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  /**
   * Username input by the user
   * @public
   */
  username = '';

  /**
   * Loading state for async operations
   * @public
   */
  loading = false;

  /**
   * Error message for failed operations
   * @public
   */
  error = '';

  /**
   * Constructor with dependency injection
   *
   * @param githubService - Service for fetching GitHub user data
   * @param router - Angular router for navigation
   * @public
   */
  constructor(
    private githubService: GithubService,
    private router: Router
  ) { }

  /**
   * Handles form submission to search for a GitHub user
   *
   * @remarks
   * Validates username, fetches user details, and navigates to user page
   *
   * @public
   */
  onSubmit() {
    // Trim and validate username
    const trimmedUsername = this.username.trim().toLowerCase();

    // GitHub username validation
    const usernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

    if (!trimmedUsername) {
      this.error = 'Por favor, insira um nome de usuário';
      return;
    }

    if (!usernameRegex.test(trimmedUsername)) {
      this.error = 'Formato de nome de usuário do GitHub inválido';
      return;
    }

    this.loading = true;
    this.error = '';

    this.githubService.getUser(trimmedUsername)
      .pipe(
        catchError(err => {
          this.loading = false;
          if (err.status === 404) {
            this.error = 'Usuário não encontrado';
          } else if (err.status === 403) {
            this.error = 'Limite de solicitações da API excedido. Tente novamente mais tarde.';
          } else {
            this.error = 'Ocorreu um erro inesperado. Por favor, tente novamente.';
          }
          return of(null);
        })
      )
      .subscribe({
        next: (user: GitHubUser | null) => {
          if (user) {
            this.loading = false;
            this.router.navigate(['/user', user.login]);
          }
        }
      });
  }

  /**
   * Clears error message when user starts typing
   *
   * @remarks
   * Optional method to improve user experience
   *
   * @public
   */
  onInput() {
    if (this.error) {
      this.error = '';
    }
  }
}
