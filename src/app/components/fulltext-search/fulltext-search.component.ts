import { Component, OnInit, ElementRef } from '@angular/core';
import { Resource } from 'src/app/models/resource.model';
import { DataService } from 'src/app/services/data.service';
import { Person } from 'src/app/models/person.model';
import { Text } from 'src/app/models/text.model';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { PlaceLight } from 'src/app/models/place.model';
import { WorkLight } from 'src/app/models/work.model';
import { Book, PublicationLight, PeriodicalArticle } from 'src/app/models/publication.model'
import { result } from 'lodash';


@Component({
  selector: 'or-fulltext-search',
  templateUrl: './fulltext-search.component.html',
  styleUrls: ['./fulltext-search.component.scss']
})
export class FulltextSearchComponent implements OnInit {

  faSearch = faSearch;

  resources: Resource[];
  person: Person;
  persons: Person[];
  text: Text;
  texts: Text[];
  ms: MsLight;
  mss: MsLight[];
  place: PlaceLight;
  places: PlaceLight[];
  msPart: MsPartLight;
  msParts: MsPartLight[];
  msFromParts: MsLight;
  works: WorkLight[];
  work: WorkLight;
  pubs: PublicationLight[];
  books: Book[];
  articles: PeriodicalArticle[];
  roudPubs: PublicationLight[];
  bookIRI: string;
  booksIRIs: string[];
  articleIRI: string;
  articlesIRIs: string[];
  bookSectionIRI: string;
  bookSectionsIRIs: string[];

  
  checkedCategoriesArray: string[] = [];
  

  constructor(
    private dataService: DataService,
    private el: ElementRef) {}

  ngOnInit() {}




  onSearch(searchText: string) {

    // empty results arrays to reinitalize search
    this.persons = [];
    this.texts = [];
    this.mss = [];
    this.places = [];
    this.msParts = [];
    this.works = [];
    this.pubs = [];


    if (searchText && searchText.length > 0) {  // check is not empty
      this.dataService.fullTextSearch(searchText).subscribe(
        (resources: Resource[]) => {
          this.resources = resources;

          // console.log(resources)
          
          // if it is too slow, it is because multiple queries (get) at the same time (en parallel)

          // RESULTS: PERSONS
          const personsIRIs = this.resources.filter(r => r.resourceClassLabel === "Person").map(r => r.id);
          if (personsIRIs && personsIRIs.length > 0) {
            this.dataService.getPersons(personsIRIs).subscribe(
              (persons: Person[]) => {
                this.persons = persons;

                // if parallel is too slow, put the following get here, once persons have finished 

              }
            );
          }

          // RESULTS: PLACES
          const placesIRIs = this.resources.filter(r => r.resourceClassLabel === "Place").map(r => r.id);
          if (placesIRIs && placesIRIs.length > 0) {
            this.dataService.getPlacesLight(placesIRIs).subscribe(
              (places: PlaceLight[]) => {
                this.places = places;
              }
            );
          }

          // RESULTS: WORKS
          const worksIRIs = this.resources.filter(r => r.resourceClassLabel === "Artwork" || r.resourceClassLabel === "Music work" || r.resourceClassLabel === "Work of literature").map(r => r.id);
          if (worksIRIs && worksIRIs.length > 0) {
            this.dataService.getWorksLight(worksIRIs).subscribe(
              (works: WorkLight[]) => {
                this.works = works;
              }
            );
          }

          // RESULTS: TEXTS
          const textsIRIs = this.resources.filter(r => r.resourceClassLabel === "Website page").map(r => r.id);
          if (textsIRIs && textsIRIs.length > 0) {
            this.dataService.getTexts(textsIRIs).subscribe(
              (texts: Text[]) => {
                this.texts = texts;
              }
            );
          }

          // RESULTS: MSS AND MSS PARTS
          const mssIRIs = this.resources.filter(r => r.resourceClassLabel === "Archival document").map(r => r.id);
          if (mssIRIs && mssIRIs.length > 0) {
            this.dataService.getMssLight(mssIRIs).subscribe(
              (mss: MsLight[]) => {
                this.mss = mss;
              }
            );
          }
          const msPartsIRIs = this.resources.filter(r => r.resourceClassLabel === "Part of a manuscript (for diary only)").map(r => r.id);
          if (msPartsIRIs && msPartsIRIs.length > 0) {
            this.dataService.getMsPartsLight(msPartsIRIs).subscribe(
              (msParts: MsPartLight[]) => {
                this.msParts = msParts;

                for (var msPart in msParts) {
                  this.dataService
                  .getMsOfMsPart(msParts[msPart].isPartOfMsValue)
                  .subscribe(
                    (msFromParts: MsLight) => {
                      this.msFromParts = msFromParts;
                    });
                  }
              }
            );
          }

          // RESULTS: PUBLICATIONS
          const pubsIRIs = this.resources.filter
            (r => r.resourceClassLabel === "Book" ||
            r.resourceClassLabel === "Periodical article"  ||
            r.resourceClassLabel === "Book section").map(r => r.id);
          if (pubsIRIs && pubsIRIs.length > 0) {
            this.dataService.getPublicationsLight(pubsIRIs).subscribe(
              (pubs: PublicationLight[]) => {
                this.pubs = pubs;

                // filter only publications by Roud, before or in 1977
                this.roudPubs = this.pubs.filter
                  (pub => pub.authorsValues.indexOf
                      ('http://rdfh.ch/0112/Rxsb1pyNS36BLLROVhIthQ') > -1
                      && pub.date.slice(10) <= '1977')
                      /* slice to remove 'GREGORIAN:' and consider '1977' as string,
                      otherwise cannot make comparison between number and string */

                // RESULTS: BOOKS          
                this.booksIRIs = this.roudPubs.filter(r => r.resourceClassLabel === "Book").map(r => r.id);
                for (var bookIRI in this.booksIRIs) {
                  this.bookIRI = this.booksIRIs[bookIRI];
                }

                // RESULTS: ARTICLES  
                this.articlesIRIs = this.roudPubs.filter(r => r.resourceClassLabel === "Periodical article").map(r => r.id);
                for (var articleIRI in this.articlesIRIs) {
                  this.articleIRI = this.articlesIRIs[articleIRI];
                }
                
                // RESULTS: BOOK SECTIONS  
                this.bookSectionsIRIs = this.roudPubs.filter(r => r.resourceClassLabel === "Book section").map(r => r.id);
                for (var bookSectionIRI in this.bookSectionsIRIs) {
                  this.bookSectionIRI = this.bookSectionsIRIs[bookSectionIRI];
                }

                /*
                if (articlesIRIs && articlesIRIs.length > 0) {
                  this.dataService.getPeriodicalArticles(articlesIRIs).subscribe(
                    (articles: PeriodicalArticle[]) => {
                      this.articles = articles;
                    }
                  );
                }
                */


                
              }
            );
          }
          

        },
        error => console.error(error)
      );
    }
  } // end on search




  show(cat: string) {
    var checkBox = document.getElementById(cat+"Checkbox") as HTMLInputElement;
    var checkedCat = cat + "Results"
    var allResults = document.getElementById("allResults").children as HTMLCollectionOf<HTMLElement> ;
    if (checkBox.checked == true){
      // define a variable for the category that has been checked and
      // push the category to the array of checked categories
      this.checkedCategoriesArray.push(checkedCat);
      // loop through children of the div containing all the results
      // if it is not in the checked categories array, do not display it
      // otherwise display it as block
      for (let index = 0; index < allResults.length; index++) {
        const eachCategResults = allResults[index];
        if (!this.checkedCategoriesArray.includes(eachCategResults.id)) {
          eachCategResults.style.display = "none";
        } else {
          eachCategResults.style.display = "block";
        }
      }
    }  
    else {
      if (this.checkedCategoriesArray.length > 1) {
        // remove unchecked categories from the array of checked categories
        // (find its position in the array and then remove it)
        var catToBeRemoved = this.checkedCategoriesArray.indexOf(checkedCat);
        this.checkedCategoriesArray.splice(catToBeRemoved,1)
        // do not display the unchecked category
        var checkedCatResults = document.getElementById(checkedCat) as HTMLElement ;
        checkedCatResults.style.display = "none";
      } else {
        // remove unchecked category from the array of checked categories
        // pop method is ok, because there is only one object in the array
        this.checkedCategoriesArray.pop();
        // show all categories
        for (let index = 0; index < allResults.length; index++) {
          const eachCategResults = allResults[index];
            eachCategResults.style.display = "block";
        }
      }
    }
  } // end show function




}