import { Component, OnInit, DoCheck } from '@angular/core';
import { Resource } from 'src/app/models/resource.model';
import { DataService } from 'src/app/services/data.service';
import { Person } from 'src/app/models/person.model';
import { Text } from 'src/app/models/text.model';
import { MsLight } from 'src/app/models/manuscript.model';
import { faSearch} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'or-fulltext-search',
  templateUrl: './fulltext-search.component.html',
  styleUrls: ['./fulltext-search.component.scss']
})
export class FulltextSearchComponent implements OnInit {

  faSearch = faSearch;
  resources: Resource[];
  person: Person;
  persons: Person[] = [];
  text: Text;
  texts: Text[] = [];
  ms: MsLight;
  mss: MsLight[] = [];
  constructor(private dataService: DataService) {}

  ngOnInit() {}

  onSearch(searchText: string) {

    // empty results arrays to reinitalize search
    this.persons = [];
    this.texts = [];


    if (searchText && searchText.length > 0) {  // check is not empty
      this.dataService.fullTextSearch(searchText).subscribe(
        (resources: Resource[]) => {
          this.resources = resources;

          //console.log(resources);


          // if it is too slow, it is because multiple queries (get) at the same time (en parallel)

          const personsIRIs = this.resources.filter(r => r.resourceClassLabel === "Person").map(r => r.id);
          this.dataService.getPersons(personsIRIs).subscribe(
            (persons: Person[]) => {
              this.persons = persons;

              // if parallel is too slow, put the following get here, once persons have finished 

            }
          );

          /*
          const textsIRIs = this.resources.filter(r => r.resourceClassLabel === "Website page").map(r => r.id);
          this.dataService.getTexts(textsIRIs).subscribe(
            (texts: Text[]) => {
              this.texts = texts;
            }
          );
          */

          const mssIRIs = this.resources.filter(r => r.resourceClassLabel === "Archival document").map(r => r.id);
          this.dataService.getMssLight(mssIRIs).subscribe(
            (mss: MsLight[]) => {
              this.mss = mss;
            }
          );

          
         

        },
        error => console.error(error)
      );
    }

    
  }
}