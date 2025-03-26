import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { GithubService } from './github.service';
import { GitHubUser } from '../interfaces/GitHubUser.interface';
import { GitHubRepo } from '../interfaces/GitHubRepo.interface';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GithubService]
    });

    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user details', () => {
    const username = 'testuser';
    const mockUser: GitHubUser = {
      login: username,
      name: 'Test User',
      bio: 'Test bio',
      followers: 100,
      following: 50,
      avatar_url: 'http://example.com/avatar.jpg',
      location: 'Test Location',
      created_at: '2024-03-26T12:00:00Z'
    };

    service.getUser(username).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${username}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should get user repos', () => {
    const username = 'testuser';
    const mockRepos: GitHubRepo[] = [
      {
        name: 'Test Repo 1',
        description: 'Test description 1',
        stargazers_count: 10,
        html_url: 'http://example.com/repo1',
        language: 'JavaScript',
        updated_at: '2024-03-25T00:00:00Z'
      },
      {
        name: 'Test Repo 2',
        description: 'Test description 2',
        stargazers_count: 20,
        html_url: 'http://example.com/repo2',
        language: 'TypeScript',
        updated_at: '2024-03-26T00:00:00Z'
      }
    ];

    service.getUserRepos(username).subscribe(repos => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${username}/repos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });

  it('should search users', () => {
    const query = 'test';
    const mockUsers: GitHubUser[] = [
      {
        login: 'testuser1',
        name: 'Test User 1',
        bio: 'Test bio 1',
        followers: 100,
        following: 50,
        avatar_url: 'http://example.com/avatar1.jpg',
        location: 'Test Location 1',
        created_at: '2024-03-26T12:00:00Z'
      },
      {
        login: 'testuser2',
        name: 'Test User 2',
        bio: 'Test bio 2',
        followers: 200,
        following: 100,
        avatar_url: 'http://example.com/avatar2.jpg',
        location: 'Test Location 2',
        created_at: '2024-03-26T12:00:00Z'
      }
    ];

    service.searchUsers(query).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`https://api.github.com/search/users?q=${query}`);
    expect(req.request.method).toBe('GET');
    req.flush({ items: mockUsers });
  });
});
