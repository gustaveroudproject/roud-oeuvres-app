import { Component, OnInit } from '@angular/core';
import { PublicationLight, PeriodicalArticle, Book, BookSection, PubPartLight } from 'src/app/models/publication.model';
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
export class PubPageComponent implements OnInit {
  
   
  publicationLight: PublicationLight;
  publicationsReused: PublicationLight[];
  publicationsReusing: PublicationLight[];
  authorLight: AuthorLight;
  periodicalArticle: PeriodicalArticle;
  periodicalLight: PeriodicalLight;
  book: Book;
  bookSection: BookSection;
  publisherLight: PublisherLight;
  pages: Page[];
  selectedPageNum: number = 1; // default value, so it visualizes the first scan when arriving on the page
  authors: AuthorLight[];
  msLight: MsLight;
  avantTexts: MsLight[];
  avantTextsParts: MsLight[];
  pubPartsLight: PubPartLight[];
  pubPartLight: PubPartLight;
  diaryNotes: MsPartLight[];


  constructor(
    
    private dataService: DataService,
    private route: ActivatedRoute // it gives me the current route (URL)
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

                    //// get diary notes reused in this publication
                    this.dataService
                    .getMsPartsReusedInPublication(publicationLight.id)
                    .subscribe((diaryNotes: MsPartLight[]) => {
                      this.diaryNotes = diaryNotes;

                      // asynchrone
                      //// get mss from ms' IRIs
                      for (var note in diaryNotes) {
                        this.dataService
                        .getMsOfMsPart(diaryNotes[note].isPartOfMsValue)
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


                    //// get publications reused in this publication
                    this.dataService
                      .getPublicationsReusedInPublication(publicationLight.id)
                      .subscribe((publicationsReused: PublicationLight[]) => {
                        this.publicationsReused = publicationsReused;
                      });


                    //// get publications reusing this publication
                    this.dataService
                      .getPublicationsReusingPublication(publicationLight.id)
                      .subscribe((publicationsReusing: PublicationLight[]) => {
                        this.publicationsReusing = publicationsReusing;
                      });


                    //// get publication parts
                    this.dataService
                      .getPartsOfPub(publicationLight.id)
                      .subscribe((pubPartsLight: PubPartLight[]) => {
                        this.pubPartsLight = pubPartsLight;
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
     
    

  }


      