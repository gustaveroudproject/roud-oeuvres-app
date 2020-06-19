import { Component, OnInit, ElementRef, AfterViewChecked, DoCheck } from '@angular/core';
import { PublicationLight, PeriodicalArticle, Book, BookSection, PubPart, PubPartLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorLight } from 'src/app/models/author.model';
import { PeriodicalLight } from 'src/app/models/periodical.model';
import { PublisherLight } from 'src/app/models/publisher.model';
import { Page } from 'src/app/models/page.model';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';


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
  pages: Page[];
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



  panelReprisesDisableState: boolean = false;
  panelGenesisDisableState: boolean = false;
  partsFullness: string[];
  partsFullness2: string[];


  constructor(
    
    private dataService: DataService,
    private route: ActivatedRoute, // it gives me the current route (URL)
    private el: ElementRef
  ) {}

  
  ngOnInit() {

    this.route.paramMap.subscribe(
          params => {
            if (params.has('iri')) {
              //// get basic properties (publicationLight) of the publication
              this.dataService
                .getPublicationLight(decodeURIComponent(params.get('iri')))
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
                    this.dataService
                      .getPagesOfPub(publicationLight.id)
                      .subscribe((pages: Page[]) => {
                        this.pages = pages;
                        //console.log(pages.length);
                        //console.log(this.selectedPageNum);
                      });


                    //// get publication parts light
                    this.dataService
                    .getPartsLightOfPub(publicationLight.id)
                    .subscribe((pubPartsLight: PubPartLight[]) => {
                      this.pubPartsLight = pubPartsLight;
                      });

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

                    
                      
                    
                    this.diaryNotes = [];
                    //// get diary notes (Manuscript) reused in this publication                    
                    this.dataService
                    .getMssReusedInPublication(publicationLight.id)
                    .subscribe((diaryNotesMss: MsLight[]) => {
                      this.diaryNotesMss = diaryNotesMss;

                      this.diaryNotes.push(...diaryNotesMss);
                    });   

                    //// get diary notes (MsPart) reused in this publication
                    this.dataService
                    .getMsPartsReusedInPublication(publicationLight.id)
                    .subscribe((diaryNotesMsParts: MsPartLight[]) => {
                      this.diaryNotesMsParts = diaryNotesMsParts;

                      this.diaryNotes.push(...diaryNotesMsParts);

                      // asynchrone
                      //// get mss from ms' IRIs
                      for (var note in diaryNotesMsParts) {
                        this.dataService
                        .getMsOfMsPart(diaryNotesMsParts[note].isPartOfMsValue)
                        .subscribe(
                          (msLight: MsLight) => {
                            this.msLight = msLight;
                          });
                        }
                    });
                    
                    
                    //// get avant-textes
                    this.dataService
                    .getAvantTexts(publicationLight.id)
                    .subscribe((avantTexts: MsLight[]) => {
                      this.avantTexts = avantTexts;
                    });

                    this.pubsReused = [];
                    //// get publications reused in this publication
                    this.dataService
                      .getPublicationsReusedInPublication(publicationLight.id)
                      .subscribe((publicationsReused: PublicationLight[]) => {
                        this.publicationsReused = publicationsReused;

                        this.pubsReused.push(...publicationsReused);

                      });

                    //// get publication parts reused in this publication
                    this.dataService
                      .getPublicationPartsReusedInPublication(publicationLight.id)
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


                    this.pubsReusing = [];
                    //// get publications reusing this publication
                    this.dataService
                      .getPublicationsReusingPublication(publicationLight.id)
                      .subscribe((publicationsReusingPub: PublicationLight[]) => {
                        this.publicationsReusingPub = publicationsReusingPub;

                        this.pubsReusing.push(...publicationsReusingPub);
                      });


                    //// get publication parts reusing this publication
                    this.dataService
                      .getPublicationPartsReusingPublication(publicationLight.id)
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
                      this.dataService
                        .getPeriodicalArticle(publicationLight.id)  // = iri
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
                        this.dataService
                          .getBook(publicationLight.id)  // = iri
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
                          this.dataService
                            .getBookSection(publicationLight.id)  // = iri
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
    this.makeMainCategoryBlackIfNotEmpty(this.el);
  }

  ngDoCheck() {
    // MOVE INTO DIRECTIVES ? NO, because it is more complicated to act on the disable attribute of the panel, which is here
    this.disableExpansionPanelReprisesIfEmtpy(this.el);
    this.disableExpansionPanelGenesisIfEmtpy(this.el);
  }

   


  /*
  ###########
  DISPLAY PUBPARTS IN EACH GENETIC CATEGORY ONLY IF THEY HAVE CHILDREN
  (diary notes, avant-textes, publication or reprises)
  ###########
  */

  // FRAGILE, maybe replace with contains
  makeLiPartAppearIfNotEmpty(el: ElementRef) {
    el.nativeElement.querySelectorAll('span[class="liPart"]').forEach((liPartElt: HTMLElement) => {  
      // if there are two UL and the second has children, that is if there are PubParts with children
      if (liPartElt.children.length > 2) {
        if (liPartElt.children[2].children[0].children.length > 0) {
          liPartElt.style.display = "block";
          liPartElt.classList.add("full");
        }
      }
    });
  }


  

  /*
  ###########
  MAKE GENETIC CATEGORY BLACK IF NOT EMPTY
  ###########
  */

  // FRAGILE, maybe replace with contains
  makeMainCategoryBlackIfNotEmpty(el: ElementRef) {
    el.nativeElement.querySelectorAll('div[class="mainCategory"]').forEach((mainCatElt: HTMLElement) => {  
      
      // check if pubParts have children, using the class added in makeLiPartAppearIfNotEmpty
      var partsFullness = [];
      if (mainCatElt.children.length > 2) {
        var pubParts = mainCatElt.children[2].children
        for (var i = 0; i < pubParts.length; i++) { 
          if (pubParts[i].children[0].classList.contains("full")) {
            partsFullness.push("full");
          }
        }
      } 
      
      // if first UL has children or if a pubPart has children (see above), color is black
      if (
        (mainCatElt.children[1].children.length > 0)
        ||
        (mainCatElt.children.length > 2 && partsFullness.length > 0)
        ) {
          mainCatElt.style.color = "black";
      }
    });
  }



  /*
  ###########
  DISABLE THE PANEL REPRISES IF IT DOES NOT CONTAIN INFO
  ###########
  */

  // FRAGILE, maybe replace with contains
  disableExpansionPanelReprisesIfEmtpy(el: ElementRef) {

    // this shold be replaced with querySelector, because it is only one
    el.nativeElement.querySelectorAll('#panelReprises').forEach((panRepElt: HTMLElement) => { 
      
      var firstUlLength = panRepElt.children[1].children[0].children[0].children[0].children.length;
      var secondUlExists = panRepElt.children[1].children[0].children[0].children.length > 1;
      
      // check if pubParts have children, using the class added in makeLiPartAppearIfNotEmpty
      var partsFullness = [];
      if (secondUlExists) {
        var pubParts = panRepElt.children[1].children[0].children[0].children[1].children;
        for (var i = 0; i < pubParts.length; i++) { 
          if (pubParts[i].children[0].classList.contains("full")) {
            partsFullness.push("full");
          }
        };
      };

      // if both ULs are empty OR if first Ul empty and if second Ul exists but parts do not have children
      if ((firstUlLength < 1 && !secondUlExists)
      || (firstUlLength < 1 && secondUlExists && partsFullness.length < 1)) {
        this.panelReprisesDisableState = true;        
      }
      else {
        this.panelReprisesDisableState = false;
        //this is important, otherwise it gets stucked in "true" when view is checked (tried with all hook methods)
      };
      
    }); 
  }
  


  /*
  ###########
  DISABLE THE PANEL GENESIS IF IT DOES NOT CONTAIN INFO
  ###########
  */

  /*
  In certain cases it does not work, because it seems to loop on one of the main categories only,
  thus blocking to 1 empty instead of 3, even if there is no first UL and second does not have children.
  See for example Air de la solitude.
  Have to change method here.
  */

  // FRAGILE, maybe replace with contains
  disableExpansionPanelGenesisIfEmtpy(el: ElementRef) {

    // this shold be replaced with querySelector, because it is only one
    el.nativeElement.querySelectorAll('#panelGenesis').forEach((panGenElt: HTMLElement) => { 

        var mainCategories = panGenElt.children[1].children[0].children;
        var categoriesFullness = [];

        // for each of the three main categories
        for (var i = 0; i < mainCategories.length; i++) { 
            var firstUlLength = mainCategories[i].children[1].children.length;
            //console.log("CATEGORY " + i + ": " + firstUlLength);
            var secondUlExists = mainCategories[i].children.length > 2;
            //console.log("CATEGORY " + i + ": " + secondUlExists);

            // check if pubParts have children, using the class added in makeLiPartAppearIfNotEmpty
            var partsFullness = [];
            if (secondUlExists) {
              var pubParts = mainCategories[i].children[2].children;
              for (var i = 0; i < pubParts.length; i++) { 
                if (pubParts[i].children[0].classList.contains("full")) {
                  partsFullness.push("full");
                }
              };
            };

            // if both ULs are empty OR
            // if first Ul empty && if second Ul exists but parts do not have children
            if ((firstUlLength < 1 && ! secondUlExists)
            || (firstUlLength < 1 && secondUlExists && partsFullness.length < 1)) {
              categoriesFullness.push("empty");
              //console.log("PUSH 1");
            }
            else {
              categoriesFullness.pop();
              //console.log("POP");
              //this is important, otherwise it gets stucked in "true" when view is checked (tried with all hook methods)
            };

        }
        
        //console.log("CATEGORIES FULNESS: " + categoriesFullness);

        if (categoriesFullness.length == 3) {
          this.panelGenesisDisableState = true;
        }
        else {
          this.panelGenesisDisableState = false;
        }
         
      
    }); 
  }
  

  
}
      