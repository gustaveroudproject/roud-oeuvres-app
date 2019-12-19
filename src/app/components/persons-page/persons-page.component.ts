import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadResource } from '@knora/api';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-persons-page',
  templateUrl: './persons-page.component.html',
  styleUrls: ['./persons-page.component.scss']
})
export class PersonsPageComponent implements OnInit {
  persons: ReadResource[];
  selectedPerson: ReadResource;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataService.getPersons().subscribe(
      (resources: ReadResource[]) => {
      this.persons = resources;
      },
      error => console.error(error)
    );

      this.route.paramMap.subscribe(
        params => {
          if (params.has('iri')) {
            this.dataService
            .getPerson(decodeURIComponent(params.get('iri')))
            .subscribe(
              (resource: ReadResource) => {
                this.selectedPerson = resource;
              },
              error => console.error(error)
            );
       }
    },
    error => console.error(error)
    );
  }
}
