import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GithubService, GitHubUser } from '../services/github.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

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

  // Optional: Clear error when user starts typing
  onInput() {
    if (this.error) {
      this.error = '';
    }
  }
}
