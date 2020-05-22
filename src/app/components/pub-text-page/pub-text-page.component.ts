import { Component, OnInit } from '@angular/core';
import { PublicationLight, Publication, PeriodicalArticle, Book, BookSection } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorLight } from 'src/app/models/author.model';
import { PeriodicalLight } from 'src/app/models/periodical.model';
import { Resource } from 'src/app/models/resource.model';
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
  resource: Resource;
  periodicalArticle: PeriodicalArticle;
  periodicalLight: PeriodicalLight;
  book: Book;
  bookSection: BookSection;
  publisherLight: PublisherLight;
  pages: Page[];
  selectedPageNum: number = 1; // default value, so it visualized the first scan when arriving on the page
  

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute // it gives me the current route (URL)
  ) {}


  ngOnInit() {

    
    this.route.paramMap.subscribe(
          params => {
            if (params.has('iri')) {
              this.dataService
                .getResource(decodeURIComponent(params.get('iri')))
                .subscribe(
                  (resource: Resource) => {
                    this.resource = resource;



                    this.dataService
                      .getPagesOfPub(resource.id)
                      .subscribe((pages: Page[]) => {
                        this.pages = pages;
                        //console.log(pages);
                        //console.log(this.selectedPageNum);
                      });


                  
                    if (resource.resourceClassLabel == 'Periodical article') {
                      this.dataService
                        .getPeriodicalArticle(resource.id)  // = iri
                        .subscribe(
                          (periodicalArticle: PeriodicalArticle) => {
                            this.periodicalArticle = periodicalArticle;
    
                            // asynchrone
                            this.dataService
                            .getAuthorLight(periodicalArticle.authorValue)
                            .subscribe(
                              (authorLight: AuthorLight) => {
                              this.authorLight = authorLight;
                              // console.log(authorLight);
                              });

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


                      if (resource.resourceClassLabel == 'Book') {
                        this.dataService
                          .getBook(resource.id)  // = iri
                          .subscribe(
                            (book: Book) => {
                              this.book = book;

                              // asynchrone
                              this.dataService
                              .getAuthorLight(book.authorValue)
                              .subscribe(
                                (authorLight: AuthorLight) => {
                                this.authorLight = authorLight;
                                // console.log(authorLight);
                                });

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

                        if (resource.resourceClassLabel == 'Book section') {
                          this.dataService
                            .getBookSection(resource.id)  // = iri
                            .subscribe(
                              (bookSection: BookSection) => {
                                this.bookSection = bookSection;
  
                                // asynchrone
                                this.dataService
                                .getAuthorLight(bookSection.authorValue)
                                .subscribe(
                                  (authorLight: AuthorLight) => {
                                  this.authorLight = authorLight;
                                  // console.log(authorLight);
                                  });
  
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
      