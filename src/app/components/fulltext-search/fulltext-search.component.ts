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
import { finalize, map } from 'rxjs/operators';
// import * as octicons from '@primer/octicons';


@Component({
  selector: 'or-fulltext-search',
  templateUrl: './fulltext-search.component.html',
  styleUrls: ['./fulltext-search.component.scss']
})
export class FulltextSearchComponent implements OnInit {

  faSearch = faSearch;

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
  booksIRIs: string[];
  articlesIRIs: string[];
  bookSectionsIRIs: string[];

  results = false;
  search = false;
  pending = false;
  searchText = "";
  
  checkedCategoriesArray: string[] = [];
  

  constructor(
    private dataService: DataService,
    private el: ElementRef) {}

  ngOnInit() {}

  onSearch() {
    this.results = false;
    this.search = true;
    this.pending = true;

    // empty results arrays to reinitalize search
    this.persons = [];
    this.texts = [];
    this.mss = [];
    this.places = [];
    this.msParts = [];
    this.works = [];
    this.pubs = [];
    this.booksIRIs = [];
    this.articlesIRIs = [];
    this.bookSectionsIRIs = [];
    this.roudPubs = [];


    if (this.searchText && this.searchText.length > 0) {  // check is not empty
      this.dataService.fullTextSearchPaged(this.searchText)
      .pipe( finalize(() => {this.pending=false;}) )
      .pipe(
        map( (resources: Resource[]) => {
          this.results = true;
          this.pending = false;

          // console.log(resources)
          
          // if it is too slow, it is because multiple queries (get) at the same time (en parallel)

          // RESULTS: PERSONS
          const personsIRIs = resources.filter(r => r.resourceClassLabel === "Person").map(r => r.id);
          if (personsIRIs && personsIRIs.length > 0) {
            this.dataService.getPersons(personsIRIs).subscribe(
              (persons: Person[]) => {
                persons.forEach( e => this.persons.push(e) );

                // if parallel is too slow, put the following get here, once persons have finished 

              }
            );
          }

          // RESULTS: PLACES
          const placesIRIs = resources.filter(r => r.resourceClassLabel === "Place").map(r => r.id);
          if (placesIRIs && placesIRIs.length > 0) {
            this.dataService.getPlacesLight(placesIRIs).subscribe(
              (places: PlaceLight[]) => {
                places.forEach( e => this.places.push(e) );
              }
            );
          }

          // RESULTS: WORKS
          const worksIRIs = resources.filter(r => r.resourceClassLabel === "Artwork" || r.resourceClassLabel === "Music work" || r.resourceClassLabel === "Work of literature").map(r => r.id);
          if (worksIRIs && worksIRIs.length > 0) {
            this.dataService.getWorksLight(worksIRIs).subscribe(
              (works: WorkLight[]) => {
                works.forEach( e => this.works.push(e) );
              }
            );
          }

          // RESULTS: TEXTS
          const textsIRIs = resources.filter(r => r.resourceClassLabel === "Website page").map(r => r.id);
          if (textsIRIs && textsIRIs.length > 0) {
            this.dataService.getTexts(textsIRIs).subscribe(
              (texts: Text[]) => {
                texts.forEach( e => this.texts.push(e) );
              }
            );
          }

          // RESULTS: MSS AND MSS PARTS
          const mssIRIs = resources.filter(r => r.resourceClassLabel === "Archival document").map(r => r.id);
          if (mssIRIs && mssIRIs.length > 0) {
            this.dataService.getMssLight(mssIRIs).subscribe(
              (mss: MsLight[]) => {
                mss.forEach( e => this.mss.push(e) );
              }
            );
          }
          const msPartsIRIs = resources.filter(r => r.resourceClassLabel === "Part of a manuscript (for diary only)").map(r => r.id);
          if (msPartsIRIs && msPartsIRIs.length > 0) {
            this.dataService.getMsPartsLight(msPartsIRIs).subscribe(
              (msParts: MsPartLight[]) => {
                msParts.forEach( e => {
                  this.msParts.push(e);

                  this.dataService
                  .getMsOfMsPart(e.isPartOfMsValue)
                  .subscribe(
                    (msFromParts: MsLight) => {
                      this.msFromParts = msFromParts;
                    });

                });

              }
            );
          }

          // RESULTS: PUBLICATIONS
          const pubsIRIs = resources.filter
            (r => r.resourceClassLabel === "Book" ||
            r.resourceClassLabel === "Periodical article"  ||
            r.resourceClassLabel === "Book section").map(r => r.id);
          if (pubsIRIs && pubsIRIs.length > 0) {
            this.dataService.getPublicationsLight(pubsIRIs).subscribe(
              (pubs: PublicationLight[]) => {
                pubs.forEach( e => this.pubs.push(e) );

                // filter only publications by Roud, before or in 1977
                
                let roudPubs = pubs.filter
                  (pub => pub.authorsValues.indexOf
                      ('http://rdfh.ch/0112/Rxsb1pyNS36BLLROVhIthQ') > -1
                      && pub.date.slice(10) <= '1977')
                      /* slice to remove 'GREGORIAN:' and consider '1977' as string,
                      otherwise cannot make comparison between number and string */
                      roudPubs.forEach( e => this.roudPubs.push(e) );

                // RESULTS: BOOKS          
                this.booksIRIs.push(...roudPubs.filter(r => r.resourceClassLabel === "Book").map(r => r.id));

                // RESULTS: ARTICLES  
                this.articlesIRIs.push(...roudPubs.filter(r => r.resourceClassLabel === "Periodical article").map(r => r.id));
                
                // RESULTS: BOOK SECTIONS  
                this.bookSectionsIRIs.push(...roudPubs.filter(r => r.resourceClassLabel === "Book section").map(r => r.id));

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
          

        }))
        .subscribe()
//        error => console.error(error)
//      );
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