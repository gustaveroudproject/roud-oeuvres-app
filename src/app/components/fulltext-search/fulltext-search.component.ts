import { Component, OnInit, ElementRef } from '@angular/core';
import { Resource } from 'src/app/models/resource.model';
import { DataService } from 'src/app/services/data.service';
import { Entity, Person, PersonLight } from 'src/app/models/person.model';
import { Text } from 'src/app/models/text.model';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { faSearch} from '@fortawesome/free-solid-svg-icons';
import { PlaceLight } from 'src/app/models/place.model';
import { WorkLight } from 'src/app/models/work.model';
import { Book, PublicationLight, PeriodicalArticle } from 'src/app/models/publication.model'
import { finalize, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthorLight } from 'src/app/models/author.model';
import { Picture } from 'src/app/models/picture.model';
import { DomSanitizer } from '@angular/platform-browser';
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
  
  expectingResults = 0;

  translatedAuthorIRI: string;
  translatedAuthor: AuthorLight;
  mssTranslatedAuthor: MsLight[];

  mssDiaryDate: MsLight[];
  mssDiaryEstablishedDate: MsLight[];
  mssDiaryYears: any;
  
  years: string;
  titleYears: string;

  about: string;

  personsWithPhoto: string[];
  somePersonsIRIs: string[] = [];
  somePersons: Entity[] = [];
  
  

  constructor(
    private dataService: DataService,
    private el: ElementRef,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer) {}
    

    finalizeWait() {
      this.expectingResults--;
      console.log("finalize: "+ this.expectingResults);
    }

  ngOnInit() {
    
    this.route.queryParams
    .pipe(finalize(() => this.finalizeWait()))
    .subscribe(params => { 
      this.translatedAuthorIRI = params.translatedAuthorIRI;
      this.years = params.years;
      this.about = params.about;

      /*
      this.dataService.getPersonsWithPhoto()
      .subscribe(
        (personsWithPhoto: PersonLight[]) => {
          this.personsWithPhoto = personsWithPhoto;
          this.entitiesWithPhoto.push(...this.personsWithPhoto);
        }
      );

      this.dataService.getPlacesWithPhoto()
      .subscribe(
        (placesWithPhoto: PlaceLight[]) => {
          this.placesWithPhoto = placesWithPhoto;
          this.entitiesWithPhoto.push(...this.placesWithPhoto);
        }
      );
      */

    this.personsWithPhoto = ["http://rdfh.ch/0112/2GP95rlkQxqHjfvuv1zAEQ", "http://rdfh.ch/0112/0EJg8HlmQ22ZxNtSYj6L5g", "http://rdfh.ch/0112/3DeFLKhnQ765ajN8eAZTtQ", "http://rdfh.ch/0112/3FyniJqgSSiXk0E2ZjYguA", "http://rdfh.ch/0112/5cJu41PCQxaOnhXH11zO9Q", "http://rdfh.ch/0112/5iQLSLEESBitc0dkyYrybA", "http://rdfh.ch/0112/6YO6qfkTS6GkM8--W0KPkg", "http://rdfh.ch/0112/9Xh_eg3XQ0G8OSLnLTH7oQ", "http://rdfh.ch/0112/FpO64L4BSPaw9R8q6pdAmA", "http://rdfh.ch/0112/HTSdSFyMS1WgbUtdUwUm-Q", "http://rdfh.ch/0112/JVzMqKLSTgWCqopLHQ7OOg", "http://rdfh.ch/0112/MWlUbTsMQgeqr2wgYPn4sw", "http://rdfh.ch/0112/PzSp-VS-StuLKkymNu20TA", "http://rdfh.ch/0112/T9bGv4JHQceo2DVstM8ilA", "http://rdfh.ch/0112/T_HfbXIgTVupJpeEmg2nJQ", "http://rdfh.ch/0112/TdA1mUr6TS-THsbv3Md_qg", "http://rdfh.ch/0112/U5cd3iv5Saud_qHn1MfkLg", "http://rdfh.ch/0112/VDFq0IWwS_Wb_tk-jdtQCQ", "http://rdfh.ch/0112/ViHU18rrTpOoo4qMNQEdOQ", "http://rdfh.ch/0112/VrNqHG1DSr6WGHz1NqECEA", "http://rdfh.ch/0112/VyN4ofOvTEO5GhxYd1LujQ", "http://rdfh.ch/0112/a6c8yy9kT-ajdFaWPVVyNQ", "http://rdfh.ch/0112/aLuGbTaHRF64vVnW4U9DLw", "http://rdfh.ch/0112/bs6F92o9TxStheHnifRkbA", "http://rdfh.ch/0112/eGCHYKzTTauVhyN5uJtINQ", "http://rdfh.ch/0112/eT5Ej14mRrmuzEYHmAHFFA","http://rdfh.ch/0112/kXcVfnVMQ821lx4dXa2lgA","http://rdfh.ch/0112/keldPxrfSvSPdhc-nKjSag","http://rdfh.ch/0112/lj13JNHJSoCdjin6HjAbdw","http://rdfh.ch/0112/ljwLu9JJTkylpWyxf60WoQ","http://rdfh.ch/0112/rY6HC2qiQZmbSQadmOSchA","http://rdfh.ch/0112/sBwa-NHMSvKKCZ01g2VWAg","http://rdfh.ch/0112/u0pXpUImTXuZZ0XynlmFAQ","http://rdfh.ch/0112/vM4VixIdQ0CQG0VPWrUCmg","http://rdfh.ch/0112/vserIi7zRPmSdHY_S4RHtQ","http://rdfh.ch/0112/w40JvWTvRz2LoTVgqBxZMQ","http://rdfh.ch/0112/yEfcPjxOQSyd5GBfxraxoQ"]
    this.somePersonsIRIs = this.pickRandomItems(this.personsWithPhoto, 4);
    
    for (var ent in this.somePersonsIRIs) {
      let entId = this.somePersonsIRIs[ent];
      this.dataService
      .getPicturesOfPerson(entId)
      .subscribe((pictures: Picture[]) => {
        this.somePersons.push(
          {
            id: entId,
            photo: pictures[0].imageURL
          }
        )
      });
    } 


      // QUERY COMING FROM ARCHIVES: TRANSLATIONS
      if (this.translatedAuthorIRI != null) {
        this.dataService.getAuthorLight(this.translatedAuthorIRI)
        .pipe(finalize(() => this.finalizeWait()))
        .subscribe(
          (translatedAuthor: AuthorLight) => {
            this.translatedAuthor = translatedAuthor;
          }
        );
        // TODO: Loic: add paging results
        this.mss = []
        this.expectingResults++;
        this.dataService.getMssTranslatedAuthor(this.translatedAuthorIRI)
        .pipe(finalize(() => this.finalizeWait()))
        .subscribe(
          (mssTranslatedAuthor: MsLight[]) => {
            this.mssTranslatedAuthor = mssTranslatedAuthor;
            this.mss.push(...mssTranslatedAuthor)
          }
        );
      }


      // QUERY COMING FROM ARCHIVES: DIARY
      else if (this.years != null) {

        this.titleYears = this.years.slice(10).replace(":", "–");
        
        this.mss = []
        this.mssDiaryYears = [];

        // TODO: Loic: add paging results
        this.dataService.getDiaryMssDate(this.years)
        .pipe(finalize(() => this.finalizeWait()))
        .subscribe(
          (mssDiaryDate: MsLight[]) => {
            this.mssDiaryDate = mssDiaryDate;
           // this.mss = [ ...mssDiaryDate];
           this.mss.push(...this.mssDiaryDate)
            
          }
        );
        // TODO: Loic: add paging results
        this.expectingResults++;
        this.dataService.getDiaryMssEstablishedDate(this.years)
        .pipe(finalize(() => this.finalizeWait()))
        .subscribe(
          (mssDiaryEstablishedDate: MsLight[]) => {
            this.mssDiaryEstablishedDate = mssDiaryEstablishedDate;
            //this.mssDiaryYears = [ ...this.mssDiaryEstablishedDate];
            //this.mss.push(...this.mssDiaryYears)
            this.mss.push(...this.mssDiaryEstablishedDate)
          }
        );
      }


      
      else if (this.about != null) {
        // QUERY COMING FROM ARCHIVES: ART AND LIT CRITICISM
        // same code is used below onSearch (with additional comments)
        this.results = false;
        this.search = true;
        this.pending = true;
        this.expectingResults++;
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

        this.dataService.fullTextSearchPaged(this.about)
        .pipe( finalize(() => {
          this.pending=false;
          this.finalizeWait();
        }) )
        .pipe(
          map( (resources: Resource[]) => {
            this.results = true;
            this.pending = false;
            // RESULTS: PERSONS
            const personsIRIs = resources.filter(r => r.resourceClassLabel === "Person").map(r => r.id);
            if (personsIRIs && personsIRIs.length > 0) {
              this.expectingResults++;
              this.dataService.getPersons(personsIRIs)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe(
                (persons: Person[]) => this.persons.push(...persons),
                // if parallel is too slow, put the following get here, once persons have finished 
                error => console.error(error)
              );
            }
            // RESULTS: PLACES
            const placesIRIs = resources.filter(r => r.resourceClassLabel === "Place").map(r => r.id);
            if (placesIRIs && placesIRIs.length > 0) {
              this.expectingResults++;
              this.dataService.getPlacesLight(placesIRIs)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe((places: PlaceLight[]) => this.places.push(...places));
            }
            // RESULTS: WORKS
            const worksIRIs = resources.filter(r => r.resourceClassLabel === "Artwork" || r.resourceClassLabel === "Music work" || r.resourceClassLabel === "Work of literature").map(r => r.id);
            if (worksIRIs && worksIRIs.length > 0) {
              this.expectingResults++;
              this.dataService.getWorksLight(worksIRIs)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe((works: WorkLight[]) => this.works.push(...works));
            }
            // RESULTS: TEXTS
            const textsIRIs = resources.filter(r => r.resourceClassLabel === "Established text").map(r => r.id);
            if (textsIRIs && textsIRIs.length > 0) {
              this.expectingResults++;
              this.dataService.getTexts(textsIRIs)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe(
                (texts: Text[]) => {
                  this.texts.push(...texts);
                  let poeticTexts = this.texts.filter
                        (text => text.editorialSet == 'Œuvre poétique');
                  this.texts = [];
                  this.texts.push(...poeticTexts);
                });
            }
            // RESULTS: MSS AND MSS PARTS
            const mssIRIs = resources.filter(r => r.resourceClassLabel === "Archival document").map(r => r.id);
            if (mssIRIs && mssIRIs.length > 0) {
              this.expectingResults++;
              this.dataService.getMssLight(mssIRIs)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe((mss: MsLight[]) => this.mss.push(...mss));
            }
            const msPartsIRIs = resources.filter(r => r.resourceClassLabel === "Part of a manuscript (for diary only)").map(r => r.id);
            if (msPartsIRIs && msPartsIRIs.length > 0) {
              this.expectingResults++;
              this.dataService.getMsPartsLight(msPartsIRIs)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe((msParts: MsPartLight[]) => {
                  msParts.forEach( e => {
                    this.msParts.push(e);
  
                    this.dataService
                    .getMsOfMsPart(e.isPartOfMsValue)
                    .subscribe(
                      (msFromParts: MsLight) => {
                        // TODO: Loic: to be checked, shouldn't it be concatenated into an array?
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
              this.expectingResults++;
              this.dataService.getPublicationsLight(pubsIRIs)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe(
                (pubs: PublicationLight[]) => {
                  this.pubs.push(...pubs);
  
                  // filter only publications by Roud, before or in 1977
                  let roudPubs = pubs.filter
                    (pub => pub.editorialSet != 'About Roud' &&  pub.editorialSet != 'Photography'
                    &&  pub.editorialSet != 'correspondance' &&  pub.editorialSet != 'Disc' 
                        && pub.date.slice(10) <= '1977'
                        );
                  this.roudPubs.push(...roudPubs);
                  // RESULTS: BOOKS          
                  this.booksIRIs.push(...roudPubs.filter(r => r.resourceClassLabel === "Book").map(r => r.id));
                  // RESULTS: ARTICLES  
                  this.articlesIRIs.push(...roudPubs.filter(r => r.resourceClassLabel === "Periodical article").map(r => r.id));                  
                  // RESULTS: BOOK SECTIONS  
                  this.bookSectionsIRIs.push(...roudPubs.filter(r => r.resourceClassLabel === "Book section").map(r => r.id));
                },
                error => console.error(error)
              );
            }
          }))
          .subscribe()
      }

      else {
        this.expectingResults = 0;
      }


    }
  );
}

  

  onSearch() {
    this.results = false;
    this.search = true;
    this.pending = true;

    this.expectingResults++;

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
      this.dataService.fullTextSearchPaged(this.searchText.includes("'")? this.searchText +" "+ this.searchText.replace("'","’"): this.searchText)
      .pipe( finalize(() => {
        this.pending=false;
        this.finalizeWait();
      }) )
      .pipe(
        map( (resources: Resource[]) => {
          this.results = true;
          this.pending = false;

          // console.log(resources)
          
          // if it is too slow, it is because multiple queries (get) at the same time (en parallel)

          // RESULTS: PERSONS
          const personsIRIs = resources.filter(r => r.resourceClassLabel === "Person").map(r => r.id);
          if (personsIRIs && personsIRIs.length > 0) {
            this.expectingResults++;
            this.dataService.getPersons(personsIRIs)
            .pipe(finalize(() => this.finalizeWait()))
            .subscribe(
              (persons: Person[]) => this.persons.push(...persons),
              // if parallel is too slow, put the following get here, once persons have finished 
              error => console.error(error)
            );
          }

          // RESULTS: PLACES
          const placesIRIs = resources.filter(r => r.resourceClassLabel === "Place").map(r => r.id);
          if (placesIRIs && placesIRIs.length > 0) {
            this.expectingResults++;
            this.dataService.getPlacesLight(placesIRIs)
            .pipe(finalize(() => this.finalizeWait()))
            .subscribe((places: PlaceLight[]) => this.places.push(...places));
          }

          // RESULTS: WORKS
          const worksIRIs = resources.filter(r => r.resourceClassLabel === "Artwork" || r.resourceClassLabel === "Music work" || r.resourceClassLabel === "Work of literature").map(r => r.id);
          if (worksIRIs && worksIRIs.length > 0) {
            this.expectingResults++;
            this.dataService.getWorksLight(worksIRIs)
            .pipe(finalize(() => this.finalizeWait()))
            .subscribe((works: WorkLight[]) => this.works.push(...works));
          }

          // RESULTS: TEXTS
          const textsIRIs = resources.filter(r => r.resourceClassLabel === "Established text").map(r => r.id);
            if (textsIRIs && textsIRIs.length > 0) {
              this.expectingResults++;
              this.dataService.getTexts(textsIRIs)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe(
                (texts: Text[]) => {
                  this.texts.push(...texts);
                  let poeticTexts = this.texts.filter
                        (text => text.editorialSet == 'Œuvre poétique');
                  this.texts = [];
                  this.texts.push(...poeticTexts);
                });
            }

          // RESULTS: MSS AND MSS PARTS
          const mssIRIs = resources.filter(r => r.resourceClassLabel === "Archival document").map(r => r.id);
          if (mssIRIs && mssIRIs.length > 0) {
            this.expectingResults++;
            this.dataService.getMssLight(mssIRIs)
            .pipe(finalize(() => this.finalizeWait()))
            .subscribe((mss: MsLight[]) => this.mss.push(...mss));
          }
          const msPartsIRIs = resources.filter(r => r.resourceClassLabel === "Part of a manuscript (for diary only)").map(r => r.id);
          if (msPartsIRIs && msPartsIRIs.length > 0) {
            this.expectingResults++;
            this.dataService.getMsPartsLight(msPartsIRIs)
            .pipe(finalize(() => this.finalizeWait()))
            .subscribe((msParts: MsPartLight[]) => {
                msParts.forEach( e => {
                  this.msParts.push(e);

                  this.dataService
                  .getMsOfMsPart(e.isPartOfMsValue)
                  .subscribe(
                    (msFromParts: MsLight) => {
                      // TODO: Loic: to be checked, shouldn't it be concatenated into an array?
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
            this.expectingResults++;
            this.dataService.getPublicationsLight(pubsIRIs)
            .pipe(finalize(() => this.finalizeWait()))
            .subscribe(
              (pubs: PublicationLight[]) => {
                this.pubs.push(...pubs);

                // filter only publications by Roud, before or in 1977
                
                let roudPubs = pubs.filter
                  (pub => pub.editorialSet != 'About Roud' &&  pub.editorialSet != 'Photography'
                  &&  pub.editorialSet != 'correspondance' &&  pub.editorialSet != 'Disc' 
                    //pub.authorsValues.includes('http://rdfh.ch/0112/Rxsb1pyNS36BLLROVhIthQ') 
                    //||
                    //pub.authorsValues.includes('http://rdfh.ch/0112/3Bz6u6y7RYS5_whDRR4FYw') ||
                    // pub.authorsValues.includes('  etc. pseudonyms
                      && pub.date.slice(10) <= '1977'
                      );
                      /* slice to remove 'GREGORIAN:' and consider '1977' as string,
                      otherwise cannot make comparison between number and string */
                this.roudPubs.push(...roudPubs);

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



              },
              error => console.error(error)
            );
          }
          

        }))
        .subscribe()
//        error => console.error(error)
//      );
    }
  } // end on search


  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  shuffle(arr: any[]) {
    let currentIndex = arr.length,  randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [arr[currentIndex], arr[randomIndex]] = [
        arr[randomIndex], arr[currentIndex]];
    }
    return arr;
  }

  pickRandomItems(arr: any[], n: number): any[]  {
    const shuffled = this.shuffle(arr);
    return shuffled.slice(0,n)
    //return Object.entries(shuffled.slice(0,n).map(entry => entry[1]));
  }


  show(cat: string) {
    var checkBox = document.getElementById(cat+"Checkbox") as HTMLInputElement;
    var checkedCat = cat + "Results"
    var allResults = document.getElementById("allResults").children as HTMLCollectionOf<HTMLElement> ;
    if (checkBox.checked == true){
      // define a variable for the category that has been checked and
      // push the category to the array of checked categories
      this.checkedCategoriesArray.push(checkedCat)
      // loop through children of the div containing all the results
      // if it is not in the checked categories array, do not display it
      // otherwise display it as block
      for (let index = 0; index < allResults.length; index++) {
        const eachCategResults = allResults[index];
        // to string, so it works also for mss and msParts together
        // actually throws an error when checking multiple cats and then unchecking the mssAndMsParts once, but works good for the rest
        if (!this.checkedCategoriesArray.toString().includes(eachCategResults.id)) { 
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

  

  showMssAndNotes() {
    this.show('msParts');
    this.show('mss');
  }




}