import { Component, OnInit, Input } from '@angular/core';
import { Text } from 'src/app/models/text.model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PersonLight } from 'src/app/models/person.model';
import { PublicationLight, PeriodicalArticle, Book, BookSection } from 'src/app/models/publication.model';
import { PeriodicalLight } from 'src/app/models/periodical.model';
import { PublisherLight } from 'src/app/models/publisher.model';

@Component({
  selector: 'or-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.scss']
})
export class TextPageComponent implements OnInit {
  text: Text;
  personsLight : PersonLight[];
  baseWitPubLight: PublicationLight;
  periodicalArticle: PeriodicalArticle;
  periodicalLight: PeriodicalLight;
  book: Book;
  bookSection: BookSection;
  publisherLight: PublisherLight;

  constructor(
    private route: ActivatedRoute, // it gives me the current route (URL)
    private dataService: DataService
  ) {}

  ngOnInit() {
    //1. recuperer IRI du URL courent (ActivatedRoute)
    //2. recuperer la ressource de Knora
    //3. construire un objet de la classe text
    //4. l'affecter à cette variable

    this.route.paramMap.subscribe(
      params => {
        this.dataService
          .getText(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .subscribe(
            (text: Text) => {
              this.text = text; // step 4    I give to the attribute text the value of text

                // asynchrone, we need text to ask persons mentioned in text
              this.dataService
              .getPersonsInText(text.id)
              .subscribe((personsLight: PersonLight[]) => {
                this.personsLight = personsLight;
                // console.log(personsLight);
              });

              this.dataService
              .getPublicationLight(text.baseWitPub)
              .subscribe((baseWitPubLight: PublicationLight) => {
                this.baseWitPubLight = baseWitPubLight;

                //// if it is a PERIODICAL ARTICLE, retrieve its properties
                if (baseWitPubLight.resourceClassLabel == 'Periodical article') {
                  this.dataService
                    .getPeriodicalArticle(baseWitPubLight.id)  // = iri
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
                  if (baseWitPubLight.resourceClassLabel == 'Book') {
                    this.dataService
                      .getBook(baseWitPubLight.id)  // = iri
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
                    if (baseWitPubLight.resourceClassLabel == 'Book section') {
                      this.dataService
                        .getBookSection(baseWitPubLight.id)  // = iri
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
              });


            },
            
            error => console.error(error)
          );
      },
      error => console.error(error)
    );

    
  }


  changeFontSize(id: string, increaseValue:number){
    var txt = document.getElementById(id);
    var style = window.getComputedStyle(txt, null).getPropertyValue('font-size');
    var currentSize = parseFloat(style);
    txt.style.fontSize = (currentSize + increaseValue) + 'px';
  }

  changeHorizontalPadding(id: string, increaseValue:number){
    var txt = document.getElementById(id);
    var currentLeftPadding = parseFloat(window.getComputedStyle(txt, null).getPropertyValue('padding-left'));
    var currentRightPadding = parseFloat(window.getComputedStyle(txt, null).getPropertyValue('padding-right'));
    txt.style.paddingLeft = (currentLeftPadding + increaseValue) + 'px';
    txt.style.paddingRight = (currentRightPadding + increaseValue) + 'px';
  }

  changeBackgroundColor(id: string, backgroundColor:string, color:string){
    var txt = document.getElementById(id);
    txt.style.backgroundColor = backgroundColor;
    txt.style.color = color;
  }

  changeLineHeight(id: string, increaseValue:number){
    var txt = document.getElementById(id);
    var style = window.getComputedStyle(txt, null).getPropertyValue('line-height');
    var currentLineHeight = parseFloat(style);
    txt.style.lineHeight = (currentLineHeight + increaseValue) + 'px';
  }

}
