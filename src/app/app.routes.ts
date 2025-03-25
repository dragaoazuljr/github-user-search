import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { UserDetailsComponent } from './user-details/user-details.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'user/:username', component: UserDetailsComponent }
];
