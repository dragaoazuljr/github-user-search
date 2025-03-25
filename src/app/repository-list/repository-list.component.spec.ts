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
})
