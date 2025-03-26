import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { UserDetailsComponent } from "./user-details.component";
import { GithubService, GitHubUser, GitHubRepo } from "../services/github.service";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { of, throwError } from 'rxjs';
import { RepositoryListComponent } from "../repository-list/repository-list.component";

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let githubService: jasmine.SpyObj<GithubService>;
  let route: ActivatedRoute;

  const mockUser: GitHubUser = {
    login: 'testuser',
    name: 'Test User',
    avatar_url: '',
    location: 'test',
    bio: 'test',
    followers: 1,
    following: 1,
    created_at: '2024-03-26T12:00:00Z'
  };

  const mockRepos: GitHubRepo[] = [
    {
      name: 'repo-1',
      description: 'test description 1',
      stargazers_count: 10,
      html_url: 'test.com/1',
      language: 'TypeScript',
      updated_at: '2024-03-26T12:00:00Z'
    },
    {
      name: 'repo-2',
      description: 'test description 2',
      stargazers_count: 20,
      html_url: 'test.com/2',
      language: 'JavaScript',
      updated_at: '2024-03-25T12:00:00Z'
    }
  ];

  beforeEach(() => {
    const githubServiceSpy = jasmine.createSpyObj('GithubService', ['getUser', 'getUserRepos']);
    githubServiceSpy.getUser.and.returnValue(of(mockUser));
    githubServiceSpy.getUserRepos.and.returnValue(of(mockRepos));

    TestBed.configureTestingModule({
      imports: [
        CommonModule, 
        FormsModule, 
        UserDetailsComponent, 
        RouterTestingModule,
        RepositoryListComponent
      ],
      providers: [
        { provide: GithubService, useValue: githubServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'testuser' })
          }
        }
      ]
    });

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    githubService = TestBed.inject(GithubService) as jasmine.SpyObj<GithubService>;
    route = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user details and repos on init', () => {
    component.ngOnInit();

    expect(githubService.getUser).toHaveBeenCalledWith('testuser');
    expect(githubService.getUserRepos).toHaveBeenCalledWith('testuser');
    expect(component.user).toEqual(mockUser);
    expect(component.repos).toEqual(mockRepos);
    expect(component.loading).toBeFalse();
  });

  it('should handle user details error', () => {
    githubService.getUser.and.returnValue(throwError(() => new Error('User not found')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error).toBe('Failed to load user details.');
    expect(component.loading).toBeFalse();
  });

  it('should handle repos error', () => {
    githubService.getUser.and.returnValue(of(mockUser));
    githubService.getUserRepos.and.returnValue(throwError(() => new Error('Repos not found')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error).toBe('Failed to load repositories.');
    expect(component.loading).toBeFalse();
  });

  it('should set repos count on load', () => {
    component.ngOnInit();
    expect(component.reposCount).toBe(mockRepos.length);
  });

  it('should handle empty repos array', () => {
    githubService.getUserRepos.and.returnValue(of([]));
    component.ngOnInit();
    expect(component.reposCount).toBe(0);
  });
});
