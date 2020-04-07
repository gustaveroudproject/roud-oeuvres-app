import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ResourceRouterComponent } from './components/resource-router/resource-router.component';
import { SearchResultsComponent } from '@knora/viewer';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { TextsPageComponent } from './components/texts-page/texts-page.component';
import { TextPageComponent } from './components/text-page/text-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EssaysPageComponent } from './components/essays-page/essays-page.component';
import { PersonPageComponent } from './components/person-page/person-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'persons',
    children: [
      { path: '', component: PersonPageComponent },
      { path: ':iri', component: PersonPageComponent }
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
    path: 'essays',
    children: [
      { path: '', component: EssaysPageComponent },
      { path: ':iri', component: EssaysPageComponent }
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
