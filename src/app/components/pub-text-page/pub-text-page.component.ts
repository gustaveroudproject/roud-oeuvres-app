import { Component, OnInit } from '@angular/core';
import { PublicationLight, Publication, PeriodicalArticle, Book, BookSection } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorLight } from 'src/app/models/author.model';
import { PeriodicalLight } from 'src/app/models/periodical.model';
import { PublisherLight } from 'src/app/models/publisher.model';
import { Page } from 'src/app/models/page.model';


@Component({
  selector: 'or-pub-text-page',
  templateUrl: './pub-text-page.component.html',
  styleUrls: ['./pub-text-page.component.scss']
})
export class PubTextPageComponent implements OnInit {

  publicationLight: PublicationLight;
  authorLight: AuthorLight;
  periodicalArticle: PeriodicalArticle;
  periodicalLight: PeriodicalLight;
  book: Book;
  bookSection: BookSection;
  publisherLight: PublisherLight;
  pages: Page[];
  selectedPageNum: number = 1; // default value, so it visualizes the first scan when arriving on the page
  authors: AuthorLight[];

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
                        //console.log(pages);
                        //console.log(this.selectedPageNum);
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
      