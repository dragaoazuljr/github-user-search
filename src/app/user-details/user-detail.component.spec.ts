import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { UserDetailsComponent } from "./user-details.component";
import { GithubService } from "../services/github.service";
import { CommonModule } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";

describe('UserDetailComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;
  let githubService: jasmine.SpyObj<GithubService>;

  beforeEach(() => {
    const githubServiceSpy = jasmine.createSpyObj('GithubService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [CommonModule, UserDetailsComponent, RouterTestingModule],
      providers: [
        { provide: GithubService, useValue: githubServiceSpy },
      ]
    });

    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    githubService = TestBed.inject(GithubService) as jasmine.SpyObj<GithubService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})

