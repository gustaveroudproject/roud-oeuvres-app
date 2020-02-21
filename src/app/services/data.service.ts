import { Injectable, Inject } from '@angular/core';
import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person, PersonLight } from '../models/person.model';
import { Resource } from '../models/resource.model';
import { Text, TextLight } from '../models/text.model';
import { Page } from '../models/page.model';

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

  getProjectIRI() {
    return 'http://rdfh.ch/projects/0112';
  }

  getOntoPrefixPath() {
    return `${this.kuiConfig.knora.apiProtocol}://${this.kuiConfig.knora.apiHost}:${this.kuiConfig.knora.apiPort}/ontology/0112/roud-oeuvres/v2#`;
  }

  fullTextSearch(searchText: string, offset = 0): Observable<Resource[]> {   //offset = 0, only first page
    return this.knoraApiConnection.v2.search
      .doFulltextSearch(searchText, offset, {
        limitToProject: this.getProjectIRI()
      })
      .pipe(
        map((
          readResources: ReadResource[] // map = je transforme quelque chose en quelque chose
        ) => readResources.map(r => this.readRes2Resource(r)))
      );
  }


  getPagesOfText(textIRI: string, index: number = 0): Observable<Page[]> {  //Observable va retourner table of Pages
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?fac knora-api:isMainResource true .
  ?fac roud-oeuvres:hasSeqnum ?seqnum .
  ?fac knora-api:hasStillImageFileValue ?imageURL .
} WHERE {
  ?fac a roud-oeuvres:Page .
  ?fac roud-oeuvres:pageIsPartOfManuscript ?man .
  <${textIRI}> roud-oeuvres:hasDirectSourceManuscript ?man .
  ?fac roud-oeuvres:hasSeqnum ?seqnum .
  ?fac knora-api:hasStillImageFileValue ?imageURL .
}
ORDER BY ?seqnum
OFFSET ${index}
`
;
  return this.knoraApiConnection.v2.search
    .doExtendedSearch(gravsearchQuery)
    .pipe(
      map((
        readResources: ReadResource[] 
      ) => readResources.map(r => {
          return this.readRes2Page(r);
        })
      )
    );
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

  readRes2Page(readResource: ReadResource): Page {  
    return {
      ...this.readRes2Resource(readResource),
      seqnum: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasSeqnum`
      ),
      imageURL: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue`
      )
    } as Page;   
  }



  readRes2PersonLight(readResource: ReadResource): PersonLight {  //this will populate PersonLight, following indications in the interface in person.mmodel.ts
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
    } as PersonLight;    //this indicates the interface declared in person.model.ts
  }

  readRes2Person(readResource: ReadResource): Person {
    return {
      ...this.readRes2PersonLight(readResource),  // person includes PersonLight's attributes
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
