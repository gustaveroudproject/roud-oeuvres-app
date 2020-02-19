import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PersonsPageComponent } from './components/persons-page/persons-page.component';
import { ResourceRouterComponent } from './components/resource-router/resource-router.component';
import { SearchResultsComponent } from '@knora/viewer';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { TextsPageComponent } from './components/texts-page/texts-page.component';
import { TextViewComponent } from './components/text-view/text-view.component';
import { TextPageComponent } from './components/text-page/text-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'persons',
    children: [
      { path: '', component: PersonsPageComponent },
      { path: ':iri', component: PersonsPageComponent }
    ]
  },
  {
    path: 'texts',
    children: [
      { path: '', component: TextsPageComponent },
      { path: ':iri', component: TextPageComponent }
    ]
  },
  {
    path: 'search',
    component: SearchPageComponent, // --> Component with the search panel
    children: [
      {
        path: ':mode/:q/:project',
        component: SearchResultsComponent // --> search results, in case of paramter filterByProject and/or projectFilter
      },
      {
        path: ':mode/:q',
        component: SearchResultsComponent
      }
    ]
  },
  { path: 'resources/:iri', component: ResourceRouterComponent }, //this component only redirects to appropriate type (knora class) of resource
  { path: 'not-found', component: NotFoundComponent }, // '/not-found' route open NotFoundComponent
  { path: '**', redirectTo: '/not-found' } // means any route got to route 'not found'
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
