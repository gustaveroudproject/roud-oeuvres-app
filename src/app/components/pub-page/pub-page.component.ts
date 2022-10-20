import { Component, OnInit, ElementRef, AfterViewChecked, DoCheck } from '@angular/core';
import { PublicationLight, PeriodicalArticle, Book, BookSection, PubPart, PubPartLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorLight } from 'src/app/models/author.model';
import { PeriodicalLight } from 'src/app/models/periodical.model';
import { PublisherLight } from 'src/app/models/publisher.model';
import { Page } from 'src/app/models/page.model';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { DomSanitizer } from '@angular/platform-browser';
import { TextLight } from 'src/app/models/text.model';
import { DataViz } from 'src/app/models/dataviz.model';
import { FileRepresentation } from '../file-representation';
import { Constants, ReadStillImageFileValue, KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';
import { DspResource } from '../dsp-resource';
import { BehaviorSubject, ReplaySubject, concat } from 'rxjs';
import { finalize, take } from 'rxjs/operators';




@Component({
  selector: 'or-pub-page',
  templateUrl: './pub-page.component.html',
  styleUrls: ['./pub-page.component.scss']
})
export class PubPageComponent implements OnInit, AfterViewChecked, DoCheck {

  /*
  Wanted to use viewChild to get back number of reused mss from child component
  to display or not the publication parts. But cannot make it work
  (checked various possibilities, including problems with *ngIf).
  Also tried with viewChildren, but no success.
*/
   
  publicationLight: PublicationLight;
  authors: AuthorLight[];
  periodicalArticle: PeriodicalArticle;
  periodicalLight: PeriodicalLight;
  book: Book;
  bookSection: BookSection;
  publisherLight: PublisherLight;
  pages: Page[] = [];
  pubPartsLight: PubPartLight[];
  startingPage: Page;
  msLight: MsLight;
  avantTexts: MsLight[];
  avantTextsParts: MsLight[];
  diaryNotes: any[]; // array with MsLight and MsPartLight together
  pubOfParts: PublicationLight;
  pubsReused: any[]; // array with publicationsReused and pubPartsReused together
  pubPartsReusingPub: PubPartLight[];
  pubOfParts3: PublicationLight;
  pubsReusing: any[]; // array with publicationsReusing and pubPartsReusingPub together
  publicationsRepublishingPub: PublicationLight[];
  publicationsRepublished: PublicationLight[];
  establishedTexts: TextLight[];
  establishedText: TextLight;

  panelReprisesDisableState: boolean = false;
  panelGenesisDisableState: boolean = false;
  partsFullness: string[];
  partsFullness2: string[];

  loadingResults = 0;

  // for viewer Pub
  imagesPubForwarder = new ReplaySubject<Page[]>();
  imagesDataVizForwarder = new ReplaySubject<Page[]>();

  dataViz: DataViz;

  constructor(
    
    private dataService: DataService,
    private route: ActivatedRoute, // it gives me the current route (URL)
    private el: ElementRef,
    public sanitizer: DomSanitizer,
    private knoraApiConnection: KnoraApiConnection,
  ) {}

  finalizeWait() {
    this.loadingResults--;
    console.log("finalize: "+ this.loadingResults);
  }


  
  ngOnInit() {

    this.route.paramMap
    .pipe(finalize(() => this.finalizeWait())).
    subscribe(
      
          params => {
            if (params.has('iri')) {
              this.loadingResults++;
              //// get basic properties (publicationLight) of the publication
              this.dataService
                .getPublicationLight(decodeURIComponent(params.get('iri')))
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe(
                  (publicationLight: PublicationLight) => {
                    this.publicationLight = publicationLight;

                    //// get authors from authors' IRIs
                    this.authors = [];
                    for (var autVal in publicationLight.authorsValues) {
                      this.dataService
                      .getAuthorLight(publicationLight.authorsValues[autVal])
                      .subscribe(
                        (authorLight: AuthorLight) => {
                          this.authors.push(authorLight);
                        });
                    }
                    
                    //// get facsimiles scans from publication IRI
                    this.loadingResults++;
                    this.dataService
                      .getAllPagesOfPub(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((pages: Page[]) => {
                        this.imagesPubForwarder.next(pages);
                        this.pages.push(...pages);              
                      });

                    //// get established text
                    this.loadingResults++;
                    this.dataService
                      .getEstablishedTextFromBasePub(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((establishedTexts: TextLight[]) => {
                        this.establishedTexts = establishedTexts;
                        this.establishedText = this.establishedTexts[0] // there will be only one item anyway
                      });

                    //// get data viz
                    this.dataService
                      .getDataViz(publicationLight.id)
                      .subscribe((dataVizs: DataViz[]) => {
                        // there will be only one item anyway
                        this.imagesDataVizForwarder.next(dataVizs);
                        // need one for the ark
                        this.dataViz = dataVizs[0];
                      });                                          


                    //// get publication parts light
                    this.loadingResults++;
                    this.dataService
                    .getAllPartsLightOfPub(publicationLight.id)
                    .pipe(finalize(() => this.finalizeWait()))
                    .subscribe((pubPartsLight: PubPartLight[]) => {
                      this.pubPartsLight = pubPartsLight;
                      });
                      /*
                    //// get publication parts
                    this.dataService
                    .getPartsOfPub(publicationLight.id)
                    .subscribe((pubParts: PubPart[]) => {
                      this.pubParts = pubParts;

                      for (var part in pubParts) {
                      this.dataService
                      .getStartingPageOfPart(pubParts[part].startingPageValue)
                      .subscribe(
                        (startingPage: Page) => {
                          this.startingPage = startingPage;
                        });
                      }
                      });
                      */

                    

                    // GENESIS STARTS
                    
                    this.diaryNotes = [];
                    //// get diary notes (Manuscript) reused in this publication   
                    this.loadingResults++;                 
                    this.dataService
                    .getAllMssReusedInPublication(publicationLight.id)
                    .pipe(finalize(() => this.finalizeWait()))
                    .subscribe((diaryNotesMss: MsLight[]) => {
                      this.diaryNotes.push(...diaryNotesMss);
                    });   

                    //// get diary notes (MsPart) reused in this publication
                    this.loadingResults++;
                    this.dataService
                    .getMsPartsReusedInPublication(publicationLight.id)
                    .pipe(finalize(() => this.finalizeWait()))
                    .subscribe((diaryNotesMsParts: MsPartLight[]) => {
                      this.diaryNotes.push(...diaryNotesMsParts);
                    });
                    
                    
                    //// get avant-textes
                    this.loadingResults++;
                    this.dataService
                    .getAvantTexts(publicationLight.id)
                    .pipe(finalize(() => this.finalizeWait()))
                    .subscribe((avantTexts: MsLight[]) => {
                      this.avantTexts = avantTexts;
                    });

                    this.pubsReused = [];
                    //// get publications reused in this publication
                    this.loadingResults++;
                    this.dataService
                      .getPublicationsReusedInPublication(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((publicationsReused: PublicationLight[]) => {
                        this.pubsReused.push(...publicationsReused);
                      });

                    //// get publication parts reused in this publication
                    this.loadingResults++;
                    this.dataService
                      .getPublicationPartsReusedInPublication(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((pubPartsReused: PubPartLight[]) => {
                        this.pubsReused.push(...pubPartsReused);                        

                        // map => turn the array of PubPartLight into and array of observables ready to run the query to get parts
                        // ... => turns array of observables into a list of them
                        // concat => RxJs chains the observables and unify their result as if they came from one
                        // take(1) => stops at the first result
                        concat(...pubPartsReused.map(part => this.dataService.getPubOfPubPart(part.isPartOfPubValue)))
                        .pipe(take(1))
                        .subscribe((pubOfParts) => {
                          // if we have a candidate, we keep it
                          this.pubOfParts = pubOfParts;
                        });

                      });
                      
                      this.loadingResults++;
                      this.dataService
                      .getPublicationsRepublishingPublication(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((publicationsRepublishingPub: PublicationLight[]) => {
                        this.publicationsRepublishingPub = publicationsRepublishingPub;
                      });


                    this.loadingResults++;
                    this.dataService
                    .getPublicationsRepublishedInPublication(publicationLight.id)
                    .pipe(finalize(() => this.finalizeWait()))
                    .subscribe((publicationsRepublished: PublicationLight[]) => {
                      this.publicationsRepublished = publicationsRepublished;

                    });


                    this.pubsReusing = [];
                    //// get publications reusing this publication
                    this.loadingResults++;
                    this.dataService
                      .getPublicationsReusingPublication(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((publicationsReusingPub: PublicationLight[]) => {
                        this.pubsReusing.push(...publicationsReusingPub);
                      });


                    //// get publication parts reusing this publication
                    this.loadingResults++;
                    this.dataService
                      .getPublicationPartsReusingPublication(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((pubPartsReusingPub: PubPartLight[]) => {
                        this.pubsReusing.push(...pubPartsReusingPub);

                        concat(...pubPartsReusingPub.map(part => this.dataService.getPubOfPubPart(part.isPartOfPubValue)))
                        .pipe(take(1))
                        .subscribe((pubOfParts) => {
                          this.pubOfParts3 = pubOfParts;
                        });

                      });


                    

                    //// if it is a PERIODICAL ARTICLE, retrieve its properties
                    if (publicationLight.resourceClassLabel == 'Periodical article') {
                      this.loadingResults++;
                      this.dataService
                        .getPeriodicalArticle(publicationLight.id)  // = iri
                        .pipe(finalize(() => this.finalizeWait()))
                        .subscribe(
                          (periodicalArticle: PeriodicalArticle) => {
                            this.periodicalArticle = periodicalArticle;
                            
                            // asynchrone
                            this.dataService
                            .getPeriodicalLight(periodicalArticle.periodicalValue)
                            .pipe(take(1))
                            .subscribe(
                              (periodicalLight: PeriodicalLight) => {
                              this.periodicalLight = periodicalLight;
                              // console.log(periodicalLight);
                              });

                          },
                          error => console.error(error)
                        );
                      }  

                      //// if it is a BOOK, retrieve its properties
                      if (publicationLight.resourceClassLabel == 'Book') {
                        this.loadingResults++;
                        this.dataService
                          .getBook(publicationLight.id)  // = iri
                          .pipe(finalize(() => this.finalizeWait()))
                          .subscribe(
                            (book: Book) => {
                              this.book = book;

                              // asynchrone
                              this.dataService
                              .getPublisherLight(book.publisherValue)
                              .pipe(take(1))
                              .subscribe(
                                (publisherLight: PublisherLight) => {
                                this.publisherLight = publisherLight;
                                });
  
                            },
                            error => console.error(error)
                          );
                        }  

                        //// if it is a BOOK SECTION, retrieve its properties
                        if (publicationLight.resourceClassLabel == 'Book section') {
                          this.loadingResults++;
                          this.dataService
                            .getBookSection(publicationLight.id)  // = iri
                            .pipe(finalize(() => this.finalizeWait()))
                            .subscribe(
                              (bookSection: BookSection) => {
                                this.bookSection = bookSection;
                                
                                // asynchrone
                                this.dataService
                                .getPublisherLight(bookSection.publisherValue)
                                .pipe(take(1))
                                .subscribe(
                                  (publisherLight: PublisherLight) => {
                                  this.publisherLight = publisherLight;
                                  });
                                
    
                              },
                              error => console.error(error)
                            );
                          } 
                          

                  },
                  error => console.error(error)
                  
                );
              }
          },
          error => console.error(error)
        );

        
        

  }

        
  
  ngAfterViewChecked() {
    // this might be transformed into directives
    this.makeLiPartAppearIfNotEmpty(this.el);
    this.greyCategoryIfEmpty(this.el);
  }

  ngDoCheck() {

    // MOVE INTO DIRECTIVES ? NO, because it is more complicated to act on the disable attribute of the panel, which is here
    this.disableExpansionPanelReprisesIfEmtpy(this.el);
    this.disableExpansionPanelGenesisIfEmtpy(this.el);
  }



   
  
  /*###########    
  DISPLAY PUBPARTS IN EACH GENETIC CATEGORY ONLY IF THEY HAVE CHILDREN
  (diary notes, avant-textes, publication or reprises)
  ###########*/ 
  makeLiPartAppearIfNotEmpty(el: ElementRef) {
    el.nativeElement.querySelectorAll('span[class="liPart"]').forEach((liPartElt: HTMLElement) => {  
      // if there are two UL and the second has children, that is if there are PubParts with children
      // FRAGILE, maybe replace with contains ?
      if (liPartElt.children.length > 2) {
        if (liPartElt.children[2].children[0].children.length > 0) {
          liPartElt.style.display = "block";
        }
      }
    });
  }

  

  /*###########
  MAKE GENETIC CATEGORY GREY IF EMPTY
  ###########*/
  greyCategoryIfEmpty(el: ElementRef) {
    el.nativeElement.querySelectorAll('div[class="mainCategory"]').forEach((mainCatEl: HTMLElement) => {
      // for each main category, how many li exists
      
      var liGenesisLength = mainCatEl.getElementsByClassName("liGenesis").length;
      
      if (liGenesisLength > 0) {
        mainCatEl.style.color = "black";        
      }
      else {
        mainCatEl.style.color = "#bfbfbf";  
      };
      
    });
  }


  



  /*###########
  DISABLE THE PANEL GENESIS IF IT DOES NOT CONTAIN INFO
  ###########*/
  disableExpansionPanelGenesisIfEmtpy(el: ElementRef) {
    // this shold be replaced with querySelector, because it is only one
    el.nativeElement.querySelectorAll('#panelGenesis').forEach((panGenElt: HTMLElement) => { 
      // check how many li exists
      var liGenesisLength = panGenElt.getElementsByClassName("liGenesis").length
      if (liGenesisLength > 0) {
        this.panelGenesisDisableState = false;        
      }
      else {
        this.panelGenesisDisableState = true;
        //this is important, otherwise it gets stucked in "true" when view is checked (tried with all hook methods)
      };
    }); 
  }



  /*###########
  DISABLE THE PANEL REPRISES IF IT DOES NOT CONTAIN INFO
  ###########*/
  disableExpansionPanelReprisesIfEmtpy(el: ElementRef) {
    // this shold be replaced with querySelector, because it is only one
    el.nativeElement.querySelectorAll('#panelReprises').forEach((panRepElt: HTMLElement) => { 
      // check how many li exists
      var liReprisesLength = panRepElt.getElementsByClassName("liGenesis").length
      if (liReprisesLength > 0) {
        this.panelReprisesDisableState = false;        
      }
      else {
        this.panelReprisesDisableState = true;
        //this is important, otherwise it gets stucked in "true" when view is checked (tried with all hook methods)
      };
    }); 
  }

}