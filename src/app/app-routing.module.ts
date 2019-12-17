import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ThingsPageComponent } from './components/things-page/things-page.component';
import { PersonsPageComponent } from './components/persons-page/persons-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'things', component: ThingsPageComponent },
  { path: 'persons', component: PersonsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
