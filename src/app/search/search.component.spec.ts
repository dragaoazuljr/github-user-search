import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { GithubService } from '../services/github.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let githubService: jasmine.SpyObj<GithubService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const githubServiceSpy = jasmine.createSpyObj('GithubService', ['getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [
        { provide: GithubService, useValue: githubServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    githubService = TestBed.inject(GithubService) as jasmine.SpyObj<GithubService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to user details page on successful search', () => {
    const username = 'testuser';
    githubService.getUser.and.returnValue(of({ login: username } as any));

    component.username = username;
    component.onSubmit();

    expect(githubService.getUser).toHaveBeenCalledWith(username);
    expect(router.navigate).toHaveBeenCalledWith(['/user', username]);
  });

  it('should display error message on user not found', () => {
    const username = 'testuser';
    githubService.getUser.and.returnValue(throwError({ status: 404 }));

    component.username = username;
    component.onSubmit();

    expect(githubService.getUser).toHaveBeenCalledWith(username);
    expect(component.error).toBe('User not found');
  });

  it('should display generic error message on other errors', () => {
    const username = 'testuser';
    githubService.getUser.and.returnValue(throwError({ status: 500 }));

    component.username = username;
    component.onSubmit();

    expect(githubService.getUser).toHaveBeenCalledWith(username);
    expect(component.error).toBe('An error occurred while searching for the user');
  });

  it('should display error message if username is empty', () => {
    component.username = '';
    component.onSubmit();

    expect(component.error).toBe('Please enter a username');
    expect(githubService.getUser).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});