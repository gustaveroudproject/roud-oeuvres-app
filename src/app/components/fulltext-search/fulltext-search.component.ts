import { Component, OnInit, ElementRef } from '@angular/core';
import { Resource } from 'src/app/models/resource.model';
import { DataService } from 'src/app/services/data.service';
import { Person } from 'src/app/models/person.model';
import { Text } from 'src/app/models/text.model';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { PlaceLight } from 'src/app/models/place.model';
import { WorkLight } from 'src/app/models/work.model';
import { AuthorLight } from 'src/app/models/author.model';


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
  workAuthor: AuthorLight;
  workAuthors: AuthorLight[];
  // workAuthoroneAuthor: AuthorLight;

  textDisabledState: Boolean = false;
  personDisabledState: Boolean = false;


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
    this.workAuthors = [];


    if (searchText && searchText.length > 0) {  // check is not empty
      this.dataService.fullTextSearch(searchText).subscribe(
        (resources: Resource[]) => {
          this.resources = resources;
          
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

                this.workAuthors = [];
                //// get authors from authors' IRIs
                for (var work in this.works) {
                  for (var autVal in works[work].authorsValues) {
                    this.dataService
                    .getAuthorLight(works[work].authorsValues[autVal])
                    .subscribe(
                      (workAuthor: AuthorLight) => {
                        this.workAuthor = workAuthor;
                        this.workAuthors.push(this.workAuthor);
                        // it might be called more than once and add the same author multiple times 
                        // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects 
                        this.workAuthors = this.workAuthors.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)                
                      }
                    );
                  }
                }
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
          /*
          const booksIRIs = this.resources.filter(r => r.resourceClassLabel === "Book").map(r => r.id);
          if (placesIRIs && placesIRIs.length > 0) {
            this.dataService.getPlaces(placesIRIs).subscribe(
              (places: Place[]) => {
                this.places = places;
              }
            );
          }
          */

        },
        error => console.error(error)
      );
    }
  } // end on search


  ngDoCheck() {
    this.disableText(this.el);
  }


  disableText(el: ElementRef) {
    var texts = document.getElementById("textsResults")
    if (texts === null) { this.textDisabledState = true; } else { this.textDisabledState = false; }
  }


  disablePersons(el: ElementRef) {
    var persons = document.getElementById("personsResults")
    if (persons === null) { this.personDisabledState = true; } else { this.personDisabledState = false; }
  }
  

  showMss() {
    var checkBox = document.getElementById("mssCheckbox") as HTMLInputElement;
    var mssResults = document.getElementById("mssResults") as HTMLElement ;
    if (checkBox.checked == true){    // need == otherwise it won't uncheck anymore ...
      mssResults.style.display = "block";
    }
    else {
      mssResults.style.display = "none";
    }
  }  // end show mss

  showPersons() {
    var checkBox = document.getElementById("personsCheckbox") as HTMLInputElement;
    var mssResults = document.getElementById("personsResults") as HTMLElement ;
    if (checkBox.checked == true){    // need == otherwise it won't uncheck anymore ...
      mssResults.style.display = "block";
    }
    else {
      mssResults.style.display = "none";
    }
  }  // end show persons


}