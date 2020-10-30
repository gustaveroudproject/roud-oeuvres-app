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
import { EssayPageComponent } from './components/essay-page/essay-page.component';
import { PersonPageComponent } from './components/person-page/person-page.component';
import { PlacePageComponent } from './components/place-page/place-page.component';
import { PubPageComponent } from './components/pub-page/pub-page.component';
import { MsPageComponent } from './components/ms-page/ms-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'persons/:iri', component: PersonPageComponent },
  { path: 'places/:iri', component: PlacePageComponent },
  {
    path: 'texts',
    children: [
      { path: '', component: TextsPageComponent },
      { path: ':iri', component: TextPageComponent }
    ]
  },
  { path: 'archive/pub/:iri', component: PubPageComponent },
  { path: 'archive/ms/:iri', component: MsPageComponent },
  {
    path: 'essays',
    children: [
      { path: '', component: EssaysPageComponent },
      { path: ':iri', component: EssayPageComponent }
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
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
