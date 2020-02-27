import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person, PersonLight } from 'src/app/models/person.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-persons-page',
  templateUrl: './persons-page.component.html',
  styleUrls: ['./persons-page.component.scss']
})
export class PersonsPageComponent implements OnInit {
  personLights: PersonLight[] = [];
  selectedPerson: PersonLight;
  index = 0;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute // it gives me the current route (URL)
  ) {}

  onLoadNextPage() {
    // console.log('test');
    this.dataService.getPersonLights(this.index).subscribe(
      (persons: PersonLight[]) => {
        this.personLights.push(...persons);  // add to array
        this.index = this.index + 1;  // increment index
      },
      error => console.error(error)
    );
  }

  ngOnInit() {
    this.onLoadNextPage();

    this.route.paramMap.subscribe(
      params => {
        if (params.has('iri')) {
          this.dataService
            .getPerson(decodeURIComponent(params.get('iri')))
            .subscribe(
              (person: Person) => {
                this.selectedPerson = person;
              },
              error => console.error(error)
            );
        }
      },
      error => console.error(error)
    );
  }
}
