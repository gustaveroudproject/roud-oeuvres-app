
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

/* FONTAWESOME ICONS */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


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
import { EssayPageComponent } from './components/essay-page/essay-page.component';
import { PersonPageComponent } from './components/person-page/person-page.component';
import { PlacePageComponent } from './components/place-page/place-page.component';
import { PlaceMapComponent } from './components/place-map/place-map.component';
import { PubPageComponent } from './components/pub-page/pub-page.component';
import { PubcAvantTextsPartComponent } from './components/pubc-avant-texts-part/pubc-avant-texts-part.component';
import { PubcPubsReusingPartComponent } from './components/pubc-pubs-reusing-part/pubc-pubs-reusing-part.component';
import { MsPageComponent } from './components/ms-page/ms-page.component';
import { PubcDiaryReusedPartComponent } from './components/pubc-diary-reused-part/pubc-diary-reused-part.component';
import { PubcPubsReusedPartComponent } from './components/pubc-pubs-reused-part/pubc-pubs-reused-part.component';
import { MscPubsReusingPartComponent } from './components/msc-pubs-reusing-part/msc-pubs-reusing-part.component';
import { MscMssRewritingPartComponent } from './components/msc-mss-rewriting-part/msc-mss-rewriting-part.component';
import { MscMssRewrittenPartComponent } from './components/msc-mss-rewritten-part/msc-mss-rewritten-part.component';



/* PIPES */
import { EncodeURIComponentPipe } from './pipes/encode-uri-component.pipe';
import { knoradatesFormattingPipe } from './pipes/knoradates-formatting.pipe';
import { knoradatesYmdFormattingPipe } from './pipes/knoradates-ymd-formatting.pipe';
import { sortBySurnamePipe } from './pipes/sort-by-surname.pipe';
import { sortByShelfmarkPipe } from './pipes/sort-by-shelfmark.pipe';
import { HtmlSanitizerPipe } from './pipes/html-sanitizer.pipe';
import { booleanPipe } from './pipes/boolean.pipe';
import { removeTextAndParPipe } from './pipes/removeTextAndP.pipe';


/* DIRECTIVES */
import { ResourceLinkDirective } from './directives/resource-link.directive';
import { PageLinkDirective } from './directives/page-link.directive';
import { RenderTeiDirective } from './directives/render-tei.directive';


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
    sortByShelfmarkPipe,
    booleanPipe,
    removeTextAndParPipe,
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
    PubPageComponent,
    PubcAvantTextsPartComponent,
    PubcPubsReusingPartComponent,
    MsPageComponent,
    PubcDiaryReusedPartComponent,
    PubcPubsReusedPartComponent,
    MscPubsReusingPartComponent,
    MscMssRewritingPartComponent,
    MscMssRewrittenPartComponent,
    RenderTeiDirective,
    EssayPageComponent
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
    }),
    FontAwesomeModule
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
