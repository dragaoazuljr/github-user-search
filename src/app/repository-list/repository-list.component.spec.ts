import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RepositoryListComponent } from "./repository-list.component";
import { GitHubRepo } from "../services/github.service";

describe('RepositoryListComponent', () => {
  let component: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;

  const mockRepos: GitHubRepo[] = [
    { 
      name: 'Repo B', 
      stargazers_count: 5, 
      description: 'Description B', 
      html_url: 'https://github.com/repoB', 
      language: 'JavaScript', 
      updated_at: '2023-02-20T00:00:00Z' 
    },
    { 
      name: 'Repo A', 
      stargazers_count: 10, 
      description: 'Description A', 
      html_url: 'https://github.com/repoA', 
      language: 'TypeScript', 
      updated_at: '2023-01-15T00:00:00Z' 
    },
    { 
      name: 'Repo C', 
      stargazers_count: 3, 
      description: 'Description C', 
      html_url: 'https://github.com/repoC', 
      language: 'Python', 
      updated_at: '2023-03-25T00:00:00Z' 
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryListComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RepositoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter repositories by name', () => {
    component.repos = mockRepos;
    component.ngOnChanges({
      repos: {
        currentValue: mockRepos,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.filterText = 'Repo B';
    component.filterRepos();
    expect(component.filteredRepos.length).toBe(1);
    expect(component.filteredRepos[0].name).toBe('Repo B');
  });

  it('should filter repositories case-insensitively', () => {
    component.repos = mockRepos;
    component.ngOnChanges({
      repos: {
        currentValue: mockRepos,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.filterText = 'repo b';
    component.filterRepos();
    expect(component.filteredRepos.length).toBe(1);
    expect(component.filteredRepos[0].name).toBe('Repo B');
  });

  it('should return all repositories when filter is empty', () => {
    component.repos = mockRepos;
    component.ngOnChanges({
      repos: {
        currentValue: mockRepos,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.filterText = '';
    component.filterRepos();
    expect(component.filteredRepos.length).toBe(3);
  });

  it('should sort repositories by name in ascending order', () => {
    component.repos = mockRepos;
    component.ngOnChanges({
      repos: {
        currentValue: mockRepos,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.sortBy = 'name';
    component.sortOrder = 'asc';
    component.filterRepos();
    expect(component.filteredRepos[0].name).toBe('Repo A');
    expect(component.filteredRepos[1].name).toBe('Repo B');
    expect(component.filteredRepos[2].name).toBe('Repo C');
  });

  it('should sort repositories by stars in descending order', () => {
    component.repos = mockRepos;
    component.ngOnChanges({
      repos: {
        currentValue: mockRepos,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.sortBy = 'stargazers_count';
    component.sortOrder = 'desc';
    component.filterRepos();
    expect(component.filteredRepos[0].stargazers_count).toBe(10);
    expect(component.filteredRepos[1].stargazers_count).toBe(5);
    expect(component.filteredRepos[2].stargazers_count).toBe(3);
  });

  it('should sort repositories by update date in descending order', () => {
    component.repos = mockRepos;
    component.ngOnChanges({
      repos: {
        currentValue: mockRepos,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.sortBy = 'updated_at';
    component.sortOrder = 'desc';
    component.filterRepos();
    expect(component.filteredRepos[0].name).toBe('Repo C');
    expect(component.filteredRepos[1].name).toBe('Repo B');
    expect(component.filteredRepos[2].name).toBe('Repo A');
  });
});
