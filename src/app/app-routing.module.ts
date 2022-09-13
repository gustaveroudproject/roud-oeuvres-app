import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ResourceRouterComponent } from './components/resource-router/resource-router.component';
//import { SearchResultsComponent } from '@knora/viewer';
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
import { WorkPageComponent } from './components/work-page/work-page.component';
import { ArchivesPageComponent } from './components/archives-page/archives-page.component';
import { ArchiveResultsPageComponent } from './components/archive-results-page/archive-results-page.component';
import { BioPageComponent } from './components/bio-page/bio-page.component';
import { ProjectPageComponent } from './components/project-page/project-page.component';
import { TechPageComponent } from './components/tech-page/tech-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'persons/:iri', component: PersonPageComponent },
  { path: 'places/:iri', component: PlacePageComponent },
  { path: 'works/:iri', component: WorkPageComponent },
  {
    path: 'texts',
    children: [
      { path: '', component: TextsPageComponent },
      { path: ':iri', component: TextPageComponent }
    ]
  },
  {
    path: 'archive',
    children: [
      { path: '', component: ArchivesPageComponent },
      { path: 'pub/:iri', component: PubPageComponent },
      { path: 'ms/:iri', component: MsPageComponent },
      { path: 'results', component: ArchiveResultsPageComponent }
    ]
  },
  {
    path: 'essays',
    children: [
      { path: '', component: EssaysPageComponent },
      { path: ':iri', component: EssayPageComponent }
    ]
  },
  {
    path: 'search',
    component: SearchPageComponent // --> Component with the search panel
  /*
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
  */
  },
  {
    path: 'bio',
    component: BioPageComponent
  },
  {
    path: 'project',
    component: ProjectPageComponent
  },
  {
    path: 'tech',
    component: TechPageComponent
  },

  { path: 'resources/:iri', component: ResourceRouterComponent }, //this component only redirects to appropriate type (knora class) of resource
  { path: 'not-found', component: NotFoundComponent }, // '/not-found' route open NotFoundComponent
  { path: '**', redirectTo: '/not-found' } // means any route got to route 'not found'
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // anchorScrolling: 'enabled'  // it should not affect the ability to go to fragment, but left here just in case for reference
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
