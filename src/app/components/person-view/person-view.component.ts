import { Component, Input, OnInit } from '@angular/core';
import { ReadResource } from '@knora/api';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'or-person-view',
  templateUrl: './person-view.component.html',
  styleUrls: ['./person-view.component.scss']
})
export class PersonViewComponent implements OnInit {
  @Input()
  person: ReadResource;
  
  constructor() {}

  ngOnInit() {}

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
