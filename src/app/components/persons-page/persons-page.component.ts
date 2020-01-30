import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/models/person.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-persons-page',
  templateUrl: './persons-page.component.html',
  styleUrls: ['./persons-page.component.scss']
})
export class PersonsPageComponent implements OnInit {
  persons = [];
  selectedPerson: Person;
  index = 0;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  onClick() {
    // console.log('test');
    this.dataService.getPersons(this.index).subscribe(
      (persons: Person[]) => {
        this.persons.push(...persons);
        this.index = this.index + 1;
      },
      error => console.error(error)
    );
  }

  ngOnInit() {
    this.dataService.getPersons().subscribe(
      (persons: Person[]) => {
        this.persons.push(...persons);
        this.index = this.index + 1;
      },
      error => console.error(error)
    );

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
