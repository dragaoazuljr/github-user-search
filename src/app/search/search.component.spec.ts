import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { GithubService } from '../services/github.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let githubService: jasmine.SpyObj<GithubService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const githubServiceSpy = jasmine.createSpyObj('GithubService', ['getUser']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [SearchComponent, FormsModule],
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
    expect(component.loading).toBeFalse();
  });

  it('should display error message on user not found', () => {
    const username = 'testuser';
    githubService.getUser.and.returnValue(throwError(() => ({ status: 404 })));

    component.username = username;
    component.onSubmit();

    expect(githubService.getUser).toHaveBeenCalledWith(username);
    expect(component.error).toBe('Usuário não encontrado');
    expect(component.loading).toBeFalse();
  });

  it('should display rate limit error message', () => {
    const username = 'testuser';
    githubService.getUser.and.returnValue(throwError(() => ({ status: 403 })));

    component.username = username;
    component.onSubmit();

    expect(githubService.getUser).toHaveBeenCalledWith(username);
    expect(component.error).toBe('Limite de solicitações da API excedido. Tente novamente mais tarde.');
    expect(component.loading).toBeFalse();
  });

  it('should display generic error message on other errors', () => {
    const username = 'testuser';
    githubService.getUser.and.returnValue(throwError(() => ({ status: 500 })));

    component.username = username;
    component.onSubmit();

    expect(githubService.getUser).toHaveBeenCalledWith(username);
    expect(component.error).toBe('Ocorreu um erro inesperado. Por favor, tente novamente.');
    expect(component.loading).toBeFalse();
  });

  it('should display error message if username is empty', () => {
    component.username = '';
    component.onSubmit();

    expect(component.error).toBe('Por favor, insira um nome de usuário');
    expect(githubService.getUser).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should display error message if username format is invalid', () => {
    component.username = '@@invalid@@';
    component.onSubmit();

    expect(component.error).toBe('Formato de nome de usuário do GitHub inválido');
    expect(githubService.getUser).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should clear error when input changes', () => {
    component.error = 'Some error';
    component.onInput();
    expect(component.error).toBe('');
  });

  it('should set loading state during API call', () => {
    const username = 'testuser';
    githubService.getUser.and.returnValue(of({ login: username } as any));

    component.username = username;
    component.onSubmit();

    expect(component.loading).toBeFalse();
  });

  it('should trim username before validation', () => {
    component.username = '  testuser  ';
    githubService.getUser.and.returnValue(of({ login: 'testuser' } as any));

    component.onSubmit();

    expect(githubService.getUser).toHaveBeenCalledWith('testuser');
  });
});
