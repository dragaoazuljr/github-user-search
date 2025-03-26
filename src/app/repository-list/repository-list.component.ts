import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GitHubRepo } from '../services/github.service';

/**
 * Component for displaying and managing a list of GitHub repositories
 * 
 * @remarks
 * This component provides functionality to:
 * - Display a list of repositories
 * - Filter repositories by name
 * - Sort repositories by different attributes
 * 
 * @public
 */
@Component({
  selector: 'app-repository-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './repository-list.component.html',
  styleUrl: './repository-list.component.scss'
})
export class RepositoryListComponent implements OnChanges {
  /** 
   * List of repositories to display 
   * @public
   */
  @Input() repos: GitHubRepo[] = [];

  /** 
   * Flag to show or hide repository filters 
   * @public
   */
  @Input() showFilters: boolean = true;

  /** 
   * Original list of repositories before filtering 
   * @private
   */
  originalRepos: GitHubRepo[] = [];

  /** 
   * Attribute to sort repositories by 
   * @public
   */
  sortBy: keyof GitHubRepo = 'updated_at';

  /** 
   * Sort order for repositories 
   * @public
   */
  sortOrder: 'asc' | 'desc' = 'desc';

  /** 
   * Text used to filter repositories 
   * @public
   */
  filterText: string = '';

  /** 
   * List of repositories after filtering 
   * @public
   */
  filteredRepos: GitHubRepo[] = [];

  /**
   * Lifecycle hook that is called when data-bound properties change
   * 
   * @param changes - Object containing current and previous property values
   * @public
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['repos']) {
      this.originalRepos = [...this.repos];
      this.filterRepos();
    }
  }

  /**
   * Filters repositories based on the current filter text
   * 
   * @remarks
   * This method filters repositories by their name, case-insensitively
   * 
   * @public
   */
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

  /**
   * Sorts the filtered repositories based on the current sort criteria
   * 
   * @remarks
   * Supports sorting by date, strings, and numbers with ascending or descending order
   * 
   * @public
   */
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

  /**
   * Sets the attribute to sort repositories by
   * 
   * @param event - Event from the sort attribute selection
   * @public
   */
  setSortBy(event: Event) {
    this.sortBy = (event.target as any).value;
    this.sortRepos();
  }

  /**
   * Sets the sort order for repositories
   * 
   * @param event - Event from the sort order selection
   * @public
   */
  setSortOrder(event: Event) {
    this.sortOrder = (event.target as any).value;
    this.sortRepos();
  }
}
