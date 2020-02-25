import { Component, OnInit } from '@angular/core';
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
    if (searchText && searchText.length > 0) {  // check is not empty
      this.dataService.fullTextSearch(searchText).subscribe(
        (resources: Resource[]) => {
          this.resources = resources;

          //console.log(resources);

          this.resources.forEach( (resource) => {

            if (resource.resourceClassLabel == "Person") {
              this.dataService.getPerson(resource.id)
              .subscribe(
                (person: Person) => {
                this.person = person;
                //console.log(person);
                this.persons.push(person);
                
              });
            }

            if (resource.resourceClassLabel == "Website page") {
              this.dataService.getText(resource.id)
              .subscribe(
                (text: Text) => {
                this.text = text;
                //console.log(text);
                this.texts.push(text);
                
              });
            }


          }
          
          )
          //console.log(this.persons);

        },
        error => console.error(error)
      );
    }

    
  }
}


///////////////////////
const res = [];
          //   for(r in readResources) {
          //     res.push(this.readRes2Person(r))
          //   }
          //   return res;