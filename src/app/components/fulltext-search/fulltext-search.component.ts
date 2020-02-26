import { Component, OnInit, DoCheck } from '@angular/core';
import { Resource } from 'src/app/models/resource.model';
import { DataService } from 'src/app/services/data.service';
import { Person } from 'src/app/models/person.model';
import { Text } from 'src/app/models/text.model';

@Component({
  selector: 'or-fulltext-search',
  templateUrl: './fulltext-search.component.html',
  styleUrls: ['./fulltext-search.component.scss']
})
export class FulltextSearchComponent implements OnInit {
  resources: Resource[];
  person: Person;
  persons: Person[] = [];
  text: Text;
  texts: Text[] = [];
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

          const personsIRIs = this.resources.filter(r => r.resourceClassLabel === "Person").map(r => r.id);

          this.dataService.getPersons(personsIRIs).subscribe(
            (persons: Person[]) => {
              this.persons = persons;
            }
          )

          const textsIRIs = this.resources.filter(r => r.resourceClassLabel === "Website page").map(r => r.id);

          this.dataService.getTexts(textsIRIs).subscribe(
            (texts: Text[]) => {
              this.texts = texts;
            }
          )

          // add texts
         

        },
        error => console.error(error)
      );
    }

    
  }
}