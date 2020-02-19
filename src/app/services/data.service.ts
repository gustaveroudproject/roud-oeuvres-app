import { Injectable, Inject } from '@angular/core';
import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person, PersonLight } from '../models/person.model';
import { Resource } from '../models/resource.model';
import { Text, TextLight } from '../models/text.model';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    @Inject(KnoraApiConnectionToken)
    private knoraApiConnection: KnoraApiConnection,
    @Inject(KuiConfigToken) private kuiConfig: KuiConfig
  ) {}

  getOntoPrefixPath() {
    return `${this.kuiConfig.knora.apiProtocol}://${this.kuiConfig.knora.apiHost}:${this.kuiConfig.knora.apiPort}/ontology/0112/roud-oeuvres/v2#`;
  }

  getPersonLights(index: number = 0): Observable<PersonLight[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?person knora-api:isMainResource true .
  ?person roud-oeuvres:personHasFamilyName ?surname .
  ?person roud-oeuvres:personHasGivenName ?name .
} WHERE {
  ?person a roud-oeuvres:Person .
  ?person roud-oeuvres:personHasFamilyName ?surname .
  ?person roud-oeuvres:personHasGivenName ?name .
} ORDER BY ASC(?surname)
OFFSET ${index}
`;
    return this.knoraApiConnection.v2.search
      .doExtendedSearch(gravsearchQuery) // cet appel, asynchrone, retourne readResource
      .pipe(
        // on se met au milieu de ce flux de données qui arrivent dans l'observable et transforme chaque donnée à la volé
        map((
          readResources: ReadResource[] // map = je transforme quelque chose en quelque chose
        ) =>
          // le suivant corréspond à
          // {
          //   const res = [];
          //   for(r in readResources) {
          //     res.push(this.readRes2Person(r))
          //   }
          //   return res;
          // }
          readResources.map(r => {
            return this.readRes2PersonLight(r);
          })
        )
      );
  }

  getPerson(iri: string): Observable<Person> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Person(readResource))
      );
  }

  getResource(iri: string): Observable<Resource> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Resource(readResource))
      );
  }

  getTextLights(index: number = 0): Observable<TextLight[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?text knora-api:isMainResource true .
  ?text roud-oeuvres:establishedTextHasTitle ?title .
} WHERE {
  ?text a roud-oeuvres:EstablishedText .
  ?text roud-oeuvres:establishedTextHasTitle ?title .
} ORDER BY ASC(?title)
OFFSET ${index}
`;
    return this.knoraApiConnection.v2.search
      .doExtendedSearch(gravsearchQuery)
      .pipe(
        map((readResources: ReadResource[]) =>
          readResources.map(r => this.readRes2TextLight(r))
        )
      );
  }

  getText(iri: string): Observable<Text> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Text(readResource))
      );
  }

  readRes2Resource(readResource: ReadResource): Resource {
    return {
      id: readResource.id,
      ark: readResource.arkUrl,
      label: readResource.label,
      resourceClassLabel: readResource.resourceClassLabel
    } as Resource;
  }

  readRes2PersonLight(readResource: ReadResource): PersonLight {
    return {
      ...this.readRes2Resource(readResource),
      surname: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasFamilyName`
      ),
      name: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasGivenName`
      )
    } as PersonLight;
  }

  readRes2Person(readResource: ReadResource): Person {
    return {
      ...this.readRes2PersonLight(readResource),
      dateOfBirth: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasBirthDate`
      ),
      dateOfDeath: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasDeathDate`
      ),
      notice: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasNotice`
      ),
      DhsID: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasDhsID`
      ),
      Viaf: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasAuthorityID`
      )
    } as Person;
  }

  readRes2TextLight(readResource: ReadResource): TextLight {
    return {
      ...this.readRes2Resource(readResource),
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}establishedTextHasTitle`
      )
    } as TextLight;
  }

  readRes2Text(readResource: ReadResource): Text {
    return {
      ...this.readRes2TextLight(readResource),
      establishedText: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasTextContent`
      )
      // imageURL: this.getFirstValueAsStringOrNullOfProperty(
      //   readResource,
      //   `http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue`
      // )
    } as Text;
  }

  getFirstValueAsStringOrNullOfProperty(
    readResource: ReadResource,
    property: string
  ) {
    const values: string[] = readResource
      ? readResource.getValuesAsStringArray(property)
      : null;
    return values && values.length >= 1 ? values[0] : null;
  }
}
