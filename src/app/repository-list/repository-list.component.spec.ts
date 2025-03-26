import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RepositoryListComponent } from "./repository-list.component";
import { Router } from "@angular/router";

describe('RepositoryListComponent', () => {
  let component: RepositoryListComponent;
  let fixture: ComponentFixture<RepositoryListComponent>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RepositoryListComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(RepositoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should sort repositories by name in ascending order', () => {
    component.repos = [
      { name: 'Repo B', stargazers_count: 5, description: 'desc', html_url: 'url', language: 'lang', updated_at: 'date' },
      { name: 'Repo A', stargazers_count: 10, description: 'desc', html_url: 'url', language: 'lang', updated_at: 'date' },
      { name: 'Repo C', stargazers_count: 3, description: 'desc', html_url: 'url', language: 'lang', updated_at: 'date' }
    ];
    component.sortBy = 'name';
    component.sortOrder = 'asc';
    component.sortRepos();
    expect(component.repos[0].name).toBe('Repo A');
    expect(component.repos[1].name).toBe('Repo B');
    expect(component.repos[2].name).toBe('Repo C');
  });

  it('should sort repositories by stars in descending order', () => {
    component.repos = [
      { name: 'Repo B', stargazers_count: 5, description: 'desc', html_url: 'url', language: 'lang', updated_at: 'date' },
      { name: 'Repo A', stargazers_count: 10, description: 'desc', html_url: 'url', language: 'lang', updated_at: 'date' },
      { name: 'Repo C', stargazers_count: 3, description: 'desc', html_url: 'url', language: 'lang', updated_at: 'date' }
    ];
    component.sortBy = 'stargazers_count';
    component.sortOrder = 'desc';
    component.sortRepos();
    expect(component.repos[0].stargazers_count).toBe(10);
    expect(component.repos[1].stargazers_count).toBe(5);
    expect(component.repos[2].stargazers_count).toBe(3);
  });

  it('should abort if has no repos', () => {
    component.repos = [];
    component.sortBy = 'name';
    component.sortOrder = 'asc';
    component.sortRepos();
    expect(component.repos.length).toBe(0);
  })

  it('should set sortBy and call sortRepos', () => {
    spyOn(component, 'sortRepos');
    const event = { target: { value: 'stargazers_count' } } as any;
    component.setSortBy(event);
    expect(component.sortBy).toBe('stargazers_count');
    expect(component.sortRepos).toHaveBeenCalled();
  });

  it('should set sortOrder and call sortRepos', () => {
    spyOn(component, 'sortRepos');
    const event = { target: { value: 'desc' } } as any;
    component.setSortOrder(event);
    expect(component.sortOrder).toBe('desc');
    expect(component.sortRepos).toHaveBeenCalled();
  });
})
