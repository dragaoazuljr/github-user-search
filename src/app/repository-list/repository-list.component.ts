import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';
import { GitHubRepo } from '../services/github.service';

@Component({
  selector: 'app-repository-list',
  imports: [CommonModule],
  templateUrl: './repository-list.component.html',
  styleUrl: './repository-list.component.scss'
})
export class RepositoryListComponent {
  @Input() repos: GitHubRepo[] = [];

  sortBy: keyof GitHubRepo = 'name';
  sortOrder: string = 'asc';

  sortRepos() {
    if (!this.repos) return;

    this.repos.sort((a, b) => {
      const valueA = a[this.sortBy];
      const valueB = b[this.sortBy];

      if (valueA < valueB) {
        return this.sortOrder === 'asc' ? -1 : 1;
      } else {
        return this.sortOrder === 'asc' ? 1 : -1;
      }
    });
  }

  setSortBy(event: Event) {
    this.sortBy = (event.target as any).value;
    this.sortRepos();
  }

  setSortOrder(event: Event) {
    this.sortOrder = (event.target as any).value;
    this.sortRepos();
  }

}
