import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ReadResource } from '@knora/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'or-person-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.scss']
})
export class PersonPageComponent implements OnInit {
  person: ReadResource;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(
      params => {
        this.dataService
          .getPerson(decodeURIComponent(params.get('iri')))
          .subscribe(
            (resource: ReadResource) => {
              this.person = resource;
            },
            error => console.error(error)
          );
      },
      error => console.error(error)
    );
  }

  getPersonSurname(person: ReadResource) {
    return this.getFirstPropertyValueOrNull(
      person,
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#personHasFamilyName`
    );
  }

  getPersonName(person: ReadResource) {
    return this.getFirstPropertyValueOrNull(
      person,
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#personHasGivenName`
    );
  }

  getFirstPropertyValueOrNull(resource: ReadResource, property: string) {
    const values: string[] = resource
      ? resource.getValuesAsStringArray(property)
      : null;
    return values && values.length >= 1 ? values[0] : null;
  }

}
