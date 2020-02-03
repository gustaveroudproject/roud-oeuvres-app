import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ThingsPageComponent } from './components/things-page/things-page.component';
import { PersonsPageComponent } from './components/persons-page/persons-page.component';
import { ResourceRouterComponent } from './components/resource-router/resource-router.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SearchPageComponent } from './components/search-page/search-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'things', component: ThingsPageComponent },
  {
    path: 'persons',
    children: [
      { path: '', component: PersonsPageComponent },
      { path: ':iri', component: PersonsPageComponent }
    ]
  },
  {
    path: 'search',
        component: SearchPageComponent,         // --> Component with the search panel
        children: [
            {
                path: ':mode/:q/:project',
                component: SearchResultsComponent       // --> search results, in case of paramter filterByProject and/or projectFilter
            },
            {
                path: ':mode/:q',
                component: SearchResultsComponent
            }
        ]
  },
  { path: 'resources/:iri', component: ResourceRouterComponent }   //this component only redirects to appropriate type (knora class) of resource
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
