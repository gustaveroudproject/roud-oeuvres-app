import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Text } from 'src/app/models/text.model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { PersonLight } from 'src/app/models/person.model';
import { PublicationLight, PeriodicalArticle, Book, BookSection } from 'src/app/models/publication.model';
import { PeriodicalLight } from 'src/app/models/periodical.model';
import { PublisherLight } from 'src/app/models/publisher.model';
import { PlaceLight } from 'src/app/models/place.model';
import { Work } from 'src/app/models/work.model';
import { AuthorLight } from 'src/app/models/author.model';
import { faLink, faExternalLinkAlt, faUser, faPencilAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'or-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.scss']
})
export class TextPageComponent implements OnInit, AfterViewInit {  

  faUser = faUser;
  faMapMarkerAlt = faMapMarkerAlt;
  faPencilAlt = faPencilAlt;
  // faExternalLinkAlt = faExternalLinkAlt;
  // faLink = faLink;
  
  text: Text;
  personsMentioned : PersonLight[];
  baseWitPubLight: PublicationLight;
  periodicalArticle: PeriodicalArticle;
  periodicalLight: PeriodicalLight;
  book: Book;
  bookSection: BookSection;
  publisherLight: PublisherLight;
  placesMentioned: PlaceLight[];
  worksMentioned: Work[];
  workAuthor: AuthorLight;
  workAuthors: AuthorLight[];

  id_fragment: string;

  
  constructor(
    private route: ActivatedRoute, // it gives me the current route (URL)
    private dataService: DataService
  ) { }

  

  ngOnInit() {

    // assign to the variable id_fragment the value of the fragment inside the URL
    // (everything after #, as built by the resource-router component)
    this.route.fragment.subscribe((fragment: string) => {
      // console.log("My hash fragment is here => ", fragment);
      this.id_fragment = fragment;
    });

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

              // asynchrone
              //// get persons mentioned in the text
              this.dataService
              .getPersonsInText(text.id)
              .subscribe((personsMentioned: PersonLight[]) => {
                this.personsMentioned = personsMentioned;
              });

              //// get places mentioned in the text
              this.dataService
              .getPlacesInText(text.id)
              .subscribe((placesMentioned: PlaceLight[]) => {
                this.placesMentioned = placesMentioned;
              });

              //// get works mentioned in the text
              this.dataService
              .getWorksInText(text.id)
              .subscribe((worksMentioned: Work[]) => {
                this.worksMentioned = worksMentioned;

                /// get works of authors
                this.workAuthors = [];
                for (var work in worksMentioned) {
                  this.dataService
                  .getAuthorLight(worksMentioned[work].authorValue)
                  .subscribe(
                    (workAuthor: AuthorLight) => {
                      this.workAuthor = workAuthor;
                      this.workAuthors.push(workAuthor);
                    });
                  }

              });

              //// get base witness publication
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
    
  };


  

  ngAfterViewInit() {

    // execute only if the URL contains a fragment, retrieved above at the beginning of ngOnInit
    if (this.id_fragment) {

      setTimeout(() => {

        // scroll into view the element identified by the fragment id
        // console.log(document.querySelector('#' + this.id_fragment));
        document.querySelector('#' + this.id_fragment).scrollIntoView({block: "center"}); // option block defines vertical alignment

        // check entities checkBox and visualize entities
        var checkBox = document.getElementById("entitiesCheckbox") as HTMLInputElement;
        checkBox.checked = true;
        this.visualizeEntities();

      }, (1000)); 
      // setTimeout indicates the time it will wait before doing this. 1000ms = 1 second.
      // If it does not wait that long, the text is not yet initialized so nothing will work.
    }; 

  };
  



  /* READER CONTROLS
  --------------------------------------------------------------------------*/
  changeFontSize(id: string, increaseValue:number){
    var txt = document.getElementById(id);
    var style = window.getComputedStyle(txt, null).getPropertyValue('font-size');
    var currentSize = parseFloat(style);
    txt.style.fontSize = (currentSize + increaseValue) + 'px';
  };

  changeHorizontalPadding(id: string, increaseValue:number){
    var txt = document.getElementById(id);
    var currentLeftPadding = parseFloat(window.getComputedStyle(txt, null).getPropertyValue('padding-left'));
    var currentRightPadding = parseFloat(window.getComputedStyle(txt, null).getPropertyValue('padding-right'));
    txt.style.paddingLeft = (currentLeftPadding + increaseValue) + 'px';
    txt.style.paddingRight = (currentRightPadding + increaseValue) + 'px';
  };

  changeBackgroundColor(id: string, backgroundColor:string, color:string){
    var txt = document.getElementById(id);
    txt.style.backgroundColor = backgroundColor;
    txt.style.color = color;
  };

  changeLineHeight(id: string, increaseValue:number){
    var txt = document.getElementById(id);
    var style = window.getComputedStyle(txt, null).getPropertyValue('line-height');
    var currentLineHeight = parseFloat(style);
    txt.style.lineHeight = (currentLineHeight + increaseValue) + 'px';
  };
  


  /* ENTITIES DISPLAY
  --------------------------------------------------------------------------*/
  visualizeEntities(){
    this.visualizeOneTypeOfEntities("tei-persName", "#F5E663");
    this.visualizeOneTypeOfEntities("tei-placeName", "#96CED9");
    this.visualizeOneTypeOfEntities("tei-ref", "#FFAD69");
  };


  visualizeOneTypeOfEntities(teiElement: string, color: string) {
    var checkBox = document.getElementById("entitiesCheckbox") as HTMLInputElement;
    var entities = Array.from(document.getElementsByClassName(teiElement) as HTMLCollectionOf<HTMLElement>);
    for (let index = 0; index < entities.length; index++) {
      const entity = entities[index];
      if (checkBox.checked == true){    // need == otherwise it won't uncheck anymore ...
        entity.style.border = "1px solid" + color;
        entity.style.borderRadius = "3px";
        entity.style.padding = "1px";
        entity.style.backgroundColor = color;
      }
      else {
        entity.style.border = "none";
        entity.style.backgroundColor = "inherit";
      }
    }
  };

}
