import { HttpClient, HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';

import { HomePageComponent } from './components/home-page/home-page.component';
import { FooterComponent } from './components/footer/footer.component';
import { knoradatesFormattingPipe } from './pipes/knoradates-formatting.pipe';
import { ResourceLinkDirective } from './directives/resource-link.directive';
import { ResourceRouterComponent } from './components/resource-router/resource-router.component';
import { EncodeURIComponentPipe } from './pipes/encode-uri-component.pipe';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiCoreModule,
  KnoraApiConfigToken
} from '@knora/core';
import { AppInitService } from './app-init.service';
import { FulltextSearchComponent } from './components/fulltext-search/fulltext-search.component';
import { KuiSearchModule } from '@knora/search';
import { KuiViewerModule } from '@knora/viewer';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { HtmlSanitizerPipe } from './pipes/html-sanitizer.pipe';
import { TextViewComponent } from './components/text-view/text-view.component';
import { TextsPageComponent } from './components/texts-page/texts-page.component';
import { TextPageComponent } from './components/text-page/text-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { FormsModule } from '@angular/forms';
import { PageLinkDirective } from './directives/page-link.directive';
import { EssaysPageComponent } from './components/essays-page/essays-page.component';
import { PersonPageComponent } from './components/person-page/person-page.component';

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
    PersonPageComponent
  ],
  imports: [
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
