import { Component, OnInit } from '@angular/core';
import { ReadResource } from '@knora/api';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-persons-page',
  templateUrl: './persons-page.component.html',
  styleUrls: ['./persons-page.component.scss']
})
export class PersonsPageComponent implements OnInit {
  persons: ReadResource[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getPersons().subscribe((resources: ReadResource[]) => {
      this.persons = resources;
    },
    error => console.error(error));
  }

  encodeURIComponent(iri: string) {
    return encodeURIComponent(iri);
  }

}
