
/* ANGULAR */
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';

/* KNORA AND KNORA-UI */
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiCoreModule,
  KnoraApiConfigToken
} from '@knora/core';
import { KuiSearchModule } from '@knora/search';
import { KuiViewerModule } from '@knora/viewer';

/* TRANSLATION */
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/* ROUTING AND SERVICES */
import { AppRoutingModule } from './app-routing.module';
import { AppInitService } from './app-init.service';

/* STYLE: BOOTSTRAP */
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

/* STYLE: ANGULAR MATERIAL */
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/* COMPONENTS */
import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { ResourceRouterComponent } from './components/resource-router/resource-router.component';
import { FulltextSearchComponent } from './components/fulltext-search/fulltext-search.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { TextViewComponent } from './components/text-view/text-view.component';
import { TextsPageComponent } from './components/texts-page/texts-page.component';
import { TextPageComponent } from './components/text-page/text-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EssaysPageComponent } from './components/essays-page/essays-page.component';
import { PersonPageComponent } from './components/person-page/person-page.component';
import { PlacePageComponent } from './components/place-page/place-page.component';
import { PlaceMapComponent } from './components/place-map/place-map.component';
import { PubTextPageComponent } from './components/pub-text-page/pub-text-page.component';
import { AvantTextsPartComponent } from './components/avant-texts-part/avant-texts-part.component';
import { PubsReusingPartComponent } from './components/pubs-reusing-part/pubs-reusing-part.component';


/* PIPES */
import { EncodeURIComponentPipe } from './pipes/encode-uri-component.pipe';
import { knoradatesFormattingPipe } from './pipes/knoradates-formatting.pipe';
import { knoradatesYmdFormattingPipe } from './pipes/knoradates-ymd-formatting.pipe';
import { sortBySurnamePipe } from './pipes/sort-by-surname.pipe';
import { HtmlSanitizerPipe } from './pipes/html-sanitizer.pipe';


/* DIRECTIVES */
import { ResourceLinkDirective } from './directives/resource-link.directive';
import { PageLinkDirective } from './directives/page-link.directive';


export function initializeApp(appInitService: AppInitService) {
  return (): Promise<any> => {
    return appInitService.Init();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    HomePageComponent,
    FooterComponent,
    knoradatesFormattingPipe,
    knoradatesYmdFormattingPipe,
    sortBySurnamePipe,
    ResourceLinkDirective,
    ResourceRouterComponent,
    FulltextSearchComponent,
    SearchPageComponent,
    HtmlSanitizerPipe,
    TextViewComponent,
    TextsPageComponent,
    TextPageComponent,
    NotFoundComponent,
    EncodeURIComponentPipe,
    PageLinkDirective,
    EssaysPageComponent,
    PersonPageComponent,
    PlacePageComponent,
    PlaceMapComponent,
    PubTextPageComponent,
    AvantTextsPartComponent,
    PubsReusingPartComponent
  ],
  imports: [
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    KuiCoreModule,
    KuiViewerModule,
    BrowserModule,
    KuiSearchModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AppInitService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitService],
      multi: true
    },
    {
      provide: KuiConfigToken,
      useFactory: () => AppInitService.kuiConfig
    },
    {
      provide: KnoraApiConfigToken,
      useFactory: () => AppInitService.knoraApiConfig
    },
    {
      provide: KnoraApiConnectionToken,
      useFactory: () => AppInitService.knoraApiConnection
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
