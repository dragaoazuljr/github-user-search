import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { UserDetailsComponent } from "./user-details.component";
import { GithubService, GitHubUser, GitHubRepo } from "../services/github.service";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { of, throwError } from 'rxjs';

describe('UserDetailComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let githubService: jasmine.SpyObj<GithubService>;
  let route: ActivatedRoute;

  beforeEach(() => {
    const githubServiceSpy = jasmine.createSpyObj('GithubService', ['getUser', 'getUserRepos']);

    TestBed.configureTestingModule({
      imports: [CommonModule, UserDetailsComponent, RouterTestingModule],
      providers: [
        { provide: GithubService, useValue: githubServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => 'testuser' })
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
    const mockUser: GitHubUser = { login: 'testuser', name: 'Test User', avatar_url: 'test.jpg', location: 'test', bio: 'test', followers: 1, following: 1 };
    const mockRepos: GitHubRepo[] = [{ name: 'testrepo', stargazers_count: 1, description: 'test', html_url: 'test.com', language: 'test', updated_at: 'test' }];
    githubService.getUser.and.returnValue(of(mockUser));
    githubService.getUserRepos.and.returnValue(of(mockRepos));

    component.ngOnInit();

    expect(githubService.getUser).toHaveBeenCalledWith('testuser');
    expect(githubService.getUserRepos).toHaveBeenCalledWith('testuser');
    expect(component.user).toEqual(mockUser);
    expect(component.repos).toEqual(mockRepos);
    expect(component.loading).toBe(false);
  });

  it('should handle user details error', () => {
    githubService.getUser.and.returnValue(throwError(() => new Error('User not found')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error).toBe('Failed to load user details.');
    expect(component.loading).toBe(false);
  });

  it('should handle repos error', () => {
    const mockUser: GitHubUser = { login: 'testuser', name: 'Test User', avatar_url: 'test.jpg', location: 'test', bio: 'test', followers: 1, following: 1 };
    githubService.getUser.and.returnValue(of(mockUser));
    githubService.getUserRepos.and.returnValue(throwError(() => new Error('Repos not found')));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.error).toBe('Failed to load repositories.');
    expect(component.loading).toBe(false);
  });
})

