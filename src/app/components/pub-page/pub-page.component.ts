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
import { ReplaySubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileRepresentation } from '../file-representation';
import { Constants, ReadStillImageFileValue, KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';

import { DspResource } from '../dsp-resource';



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
  authorLight: AuthorLight;
  authors: AuthorLight[];
  periodicalArticle: PeriodicalArticle;
  periodicalLight: PeriodicalLight;
  book: Book;
  bookSection: BookSection;
  publisherLight: PublisherLight;
  pages: Page[] = [];
  firstPageSwitch = true;
  firstPageUrl = new ReplaySubject<string>();
  selectedPageNum: number = 1; // default value, so it visualizes the first scan when arriving on the page
  selectedPartNum: number = 1; // default value, so it visualizes the first scan when arriving on the page
  pubPartsLight: PubPartLight[];
  pubParts: PubPart[];
  startingPage: Page;
  msLight: MsLight;
  avantTexts: MsLight[];
  avantTextsParts: MsLight[];
  diaryNotesMsParts: MsPartLight[];
  diaryNotesMss: MsLight[];
  diaryNotes: any[]; // array with MsLight and MsPartLight together
  publicationsReused: PublicationLight[];
  pubPartsReused: PubPartLight[];
  pubOfParts: PublicationLight;
  pubsReused: any[]; // array with publicationsReused and pubPartsReused together
  publicationsReusingPub: PublicationLight[];
  pubPartsReusingPub: PubPartLight[];
  pubOfParts3: PublicationLight;
  pubsReusing: any[]; // array with publicationsReusing and pubPartsReusingPub together
  publicationsRepublishingPub: PublicationLight[];
  publicationsRepublished: PublicationLight[];
  establishedTexts: TextLight[];
  establishedText: TextLight;
  dataViz: DataViz;
  dataVizs: DataViz[];


  panelReprisesDisableState: boolean = false;
  panelGenesisDisableState: boolean = false;
  partsFullness: string[];
  partsFullness2: string[];

  loadingResults = 0;

  // for viewer
  iiifURL:string = "https://iiif.ls-prod-server.dasch.swiss";
  project:string = "http://rdfh.ch/projects/0112";
  images: FileRepresentation[] = [];

  // for the annotations e.g. regions in a still image representation
  annotationResources: DspResource[];
  resource: DspResource;



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
                          this.authorLight = authorLight;
                          this.authors.push(authorLight);
                        });
                      }
                      
                    //// get facsimiles scans from publication IRI
                    this.loadingResults++;
                    this.dataService
                      .getAllPagesOfPub(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((pages: Page[]) => {
                        if (this.firstPageSwitch) {
                          this.firstPageSwitch = false;
                          this.firstPageUrl.next(pages[0].imageURL);
                        }
                        this.pages.push(...pages);
                        //console.log(pages.length);
                        //console.log(this.selectedPageNum);
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
                    this.loadingResults++;
                    this.dataService
                      .getDataViz(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((dataVizs: DataViz[]) => {
                        this.dataViz = dataVizs[0]; // there will be only one item anyway

                        
                        this.knoraApiConnection.v2.res
                        .getResource(this.dataViz.id)
                        .subscribe(
                          (response: ReadResource) => {
                            const res = new DspResource(response);
                            this.resource = res;
                        
                            this.images = this.collectRepresentationsAndAnnotations(this.resource);
                          });

                      });                                          



                    //// get publication parts light
                    this.loadingResults++;
                    this.dataService
                    .getPartsLightOfPub(publicationLight.id)
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
                    .getMssReusedInPublication(publicationLight.id)
                    .pipe(finalize(() => this.finalizeWait()))
                    .subscribe((diaryNotesMss: MsLight[]) => {
                      this.diaryNotesMss = diaryNotesMss;

                      this.diaryNotes.push(...diaryNotesMss);
                    });   

                    //// get diary notes (MsPart) reused in this publication
                    this.loadingResults++;
                    this.dataService
                    .getMsPartsReusedInPublication(publicationLight.id)
                    .pipe(finalize(() => this.finalizeWait()))
                    .subscribe((diaryNotesMsParts: MsPartLight[]) => {
                      this.diaryNotesMsParts = diaryNotesMsParts;

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
                        this.publicationsReused = publicationsReused;

                        this.pubsReused.push(...publicationsReused);

                      });

                    //// get publication parts reused in this publication
                    this.loadingResults++;
                    this.dataService
                      .getPublicationPartsReusedInPublication(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((pubPartsReused: PubPartLight[]) => {
                        this.pubPartsReused = pubPartsReused;

                        this.pubsReused.push(...pubPartsReused);

                        // asynchrone
                        //// get publications from publications' IRIs
                        for (var pub in pubPartsReused) {
                          this.dataService
                          .getPubOfPubPart(pubPartsReused[pub].isPartOfPubValue)
                          .subscribe(
                            (pubOfParts: PublicationLight) => {
                              this.pubOfParts = pubOfParts;
                            });
                          }
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
                        this.publicationsReusingPub = publicationsReusingPub;

                        this.pubsReusing.push(...publicationsReusingPub);
                      });


                    //// get publication parts reusing this publication
                    this.loadingResults++;
                    this.dataService
                      .getPublicationPartsReusingPublication(publicationLight.id)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe((pubPartsReusingPub: PubPartLight[]) => {
                        this.pubPartsReusingPub = pubPartsReusingPub;

                        this.pubsReusing.push(...pubPartsReusingPub);

                        // asynchrone
                        //// get publications from publications' IRIs
                        for (var pub in pubPartsReusingPub) {
                          this.dataService
                          .getPubOfPubPart(pubPartsReusingPub[pub].isPartOfPubValue)
                          .subscribe(
                            (pubOfParts3: PublicationLight) => {
                              this.pubOfParts3 = pubOfParts3;
                            });
                          }
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


 


// FROM https://github.com/dasch-swiss/dsp-app/blob/9bb63d71234fc49f2afcb959603b8bcd4deb4429/src/app/workspace/resource/resource.component.ts#L355
// only taken a part of it relevant for still images

    /**
     * creates a collection of [[StillImageRepresentation]] belonging to the given resource and assigns it to it.
     * each [[StillImageRepresentation]] represents an image including regions.     *
     * @param resource The resource to get the images for.
     * @returns A collection of images for the given resource.
     */
   protected collectRepresentationsAndAnnotations(resource: DspResource): FileRepresentation[] {
    if (!resource) {
        return;
    }
    const representations: FileRepresentation[] = [];
        const fileValues: ReadStillImageFileValue[] = resource.res.properties[Constants.HasStillImageFileValue] as ReadStillImageFileValue[];
        for (const img of fileValues) {

            //const regions: Region[] = [];
            const regions: any[] = [] // we do not have type Region
            const annotations: DspResource[] = [];
            /*  // comment out all about regions
            for (const incomingRegion of resource.incomingAnnotations) {
                const region = new Region(incomingRegion);
                regions.push(region);
                const annotation = new DspResource(incomingRegion);
                // gather region property information
                annotation.resProps = this.initProps(incomingRegion);
                // gather system property information
                annotation.systemProps = incomingRegion.entityInfo.getPropertyDefinitionsByType(SystemPropertyDefinition);
                annotations.push(annotation);
            }*/
            const stillImage = new FileRepresentation(img);
            representations.push(stillImage);
            this.annotationResources = annotations; 
            /* // comment out all about annotations and dsp-app interface
            if (this.valueUuid === 'annotations' || this.selectedRegion === this.resourceIri) {
                this.selectedTab = (this.incomingResource ? 2 : 1);
                this.selectedTabLabel = 'annotations';
            }*/
        }

    return representations;
}

}