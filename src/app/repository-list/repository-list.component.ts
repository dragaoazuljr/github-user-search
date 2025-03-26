import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GitHubRepo } from '../services/github.service';

@Component({
  selector: 'app-repository-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './repository-list.component.html',
  styleUrl: './repository-list.component.scss'
})
export class RepositoryListComponent implements OnChanges {
  @Input() repos: GitHubRepo[] = [];
  @Input() showFilters: boolean = true;

  originalRepos: GitHubRepo[] = [];
  sortBy: keyof GitHubRepo = 'updated_at';
  sortOrder: 'asc' | 'desc' = 'desc';
  filterText: string = '';
  filteredRepos: GitHubRepo[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['repos']) {
      this.originalRepos = [...this.repos];
      this.filterRepos();
    }
  }

  filterRepos() {
    if (!this.filterText) {
      this.filteredRepos = [...this.originalRepos];
    } else {
      const lowerFilterText = this.filterText.toLowerCase();
      this.filteredRepos = this.originalRepos.filter(repo => 
        repo.name.toLowerCase().includes(lowerFilterText)
      );
    }
    this.sortRepos();
  }

  sortRepos(): void {
    this.filteredRepos.sort((a, b) => {
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

  setSortBy(event: Event) {
    this.sortBy = (event.target as any).value;
    this.sortRepos();
  }

  setSortOrder(event: Event) {
    this.sortOrder = (event.target as any).value;
    this.sortRepos();
  }
}
