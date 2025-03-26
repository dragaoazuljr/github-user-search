import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RepositoryListComponent } from "./repository-list.component";
import { GitHubRepo } from "../interfaces/GitHubRepo.interface";

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

  it('should initialize with default values', () => {
    expect(component.repos).toEqual([]);
    expect(component.showFilters).toBeTrue();
    expect(component.sortBy).toBe('updated_at');
    expect(component.sortOrder).toBe('desc');
    expect(component.filterText).toBe('');
    expect(component.filteredRepos).toEqual([]);
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

  it('should handle undefined values in sorting', () => {
    const reposWithUndefined = [
      { ...mockRepos[0], description: undefined },
      { ...mockRepos[1] }
    ];
    component.repos = reposWithUndefined;
    component.ngOnChanges({
      repos: {
        currentValue: reposWithUndefined,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.sortBy = 'description';
    component.sortOrder = 'asc';
    component.filterRepos();
    expect(component.filteredRepos.length).toBe(2);
  });

  it('should handle empty repos array', () => {
    component.repos = [];
    component.ngOnChanges({
      repos: {
        currentValue: [],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.filteredRepos.length).toBe(0);
  });

  it('should handle setSortBy event', () => {
    spyOn(component, 'sortRepos');
    const event = { target: { value: 'name' } } as any;
    component.setSortBy(event);
    expect(component.sortBy).toBe('name');
    expect(component.sortRepos).toHaveBeenCalled();
  });

  it('should handle setSortOrder event', () => {
    spyOn(component, 'sortRepos');
    const event = { target: { value: 'asc' } } as any;
    component.setSortOrder(event);
    expect(component.sortOrder).toBe('asc');
    expect(component.sortRepos).toHaveBeenCalled();
  });

  it('should not trigger ngOnChanges when repos is not changed', () => {
    spyOn(component, 'filterRepos');
    component.ngOnChanges({
      showFilters: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    expect(component.filterRepos).not.toHaveBeenCalled();
  });

  it('should handle partial repo data', () => {
    const partialRepo = {
      name: 'Partial Repo',
      stargazers_count: 1,
      html_url: 'https://github.com/partial',
      updated_at: '2023-01-01T00:00:00Z'
    } as GitHubRepo;

    component.repos = [partialRepo];
    component.ngOnChanges({
      repos: {
        currentValue: [partialRepo],
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    expect(component.filteredRepos.length).toBe(1);
    expect(component.filteredRepos[0].name).toBe('Partial Repo');
  });

  it('should handle multiple filters and sorts', () => {
    component.repos = mockRepos;
    component.ngOnChanges({
      repos: {
        currentValue: mockRepos,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });

    // Primeiro filtro
    component.filterText = 'Repo';
    component.filterRepos();
    expect(component.filteredRepos.length).toBe(3);

    // Adiciona ordenação
    component.sortBy = 'stargazers_count';
    component.sortOrder = 'desc';
    component.sortRepos();
    expect(component.filteredRepos[0].stargazers_count).toBe(10);

    // Adiciona mais filtro
    component.filterText = 'Repo A';
    component.filterRepos();
    expect(component.filteredRepos.length).toBe(1);
    expect(component.filteredRepos[0].name).toBe('Repo A');
  });

  it('should handle non-matching filter text', () => {
    component.repos = mockRepos;
    component.ngOnChanges({
      repos: {
        currentValue: mockRepos,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });
    component.filterText = 'NonExistent';
    component.filterRepos();
    expect(component.filteredRepos.length).toBe(0);
  });

  it('should handle non-standard value types in sorting', () => {
    const reposWithNonStandardValues = [
      { ...mockRepos[0] },
      { ...mockRepos[1] }
    ] as GitHubRepo[];

    // Adiciona uma propriedade com um tipo não padrão
    (reposWithNonStandardValues[0] as any).customField = { value: 1 };
    (reposWithNonStandardValues[1] as any).customField = { value: 2 };

    component.repos = reposWithNonStandardValues;
    component.ngOnChanges({
      repos: {
        currentValue: reposWithNonStandardValues,
        previousValue: [],
        firstChange: true,
        isFirstChange: () => true
      }
    });

    // Tenta ordenar pelo campo customField
    component.sortBy = 'customField' as keyof GitHubRepo;
    component.filterRepos();

    // A ordem deve permanecer a mesma
    expect(component.filteredRepos[0].name).toBe('Repo B');
    expect(component.filteredRepos[1].name).toBe('Repo A');
  });
});
