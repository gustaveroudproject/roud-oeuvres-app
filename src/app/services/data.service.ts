import { Injectable, Inject } from '@angular/core';
import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person } from '../models/person.model';
import { Thing } from '../models/thing.model';
import { Resource} from '../models/resource.model';
import { Text} from '../models/text.model';
import { KnoraApiConnectionToken, KuiConfigToken, KuiConfig } from '@knora/core';


@Injectable({
  providedIn: 'root'
})

export class DataService {

  constructor(
    @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
    @Inject(KuiConfigToken) private kuiConfig: KuiConfig) {

  }

  getOntoPrefixPath() {
    return `${this.kuiConfig.knora.apiProtocol}://${this.kuiConfig.knora.apiHost}:${this.kuiConfig.knora.apiPort}`;
  }



  getPersons(index: number = 0): Observable<Person[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#>
CONSTRUCT {
  ?person knora-api:isMainResource true .
} WHERE {
  ?person a roud-oeuvres:Person .
  ?person roud-oeuvres:personHasFamilyName ?surname .
} ORDER BY ASC(?surname)
OFFSET ${index}
`;  
    return this.knoraApiConnection.v2.search
      .doExtendedSearch(gravsearchQuery)
      .pipe(
        map((readResources: ReadResource[]) =>
          readResources.map(r => {
            return new Person(r, this.kuiConfig);
          })
        ) 
      );
      
  }

  getPerson(iri: string): Observable<Person> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(map((readResource: ReadResource) => new Person(readResource, this.kuiConfig)));
  }

  getThings(): Observable<Thing[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX any: <${this.getOntoPrefixPath()}/ontology/0001/anything/v2#>
CONSTRUCT {
  ?thing knora-api:isMainResource true .
} WHERE {
  ?thing a any:Thing .
}`;
    return this.knoraApiConnection.v2.search
      .doExtendedSearch(gravsearchQuery)
      .pipe(
        map((readResources: ReadResource[]) =>
          readResources.map(r => new Thing(r))
        )
      );
  }



  getResource(iri: string): Observable<Resource> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(map((readResource: ReadResource) => new Resource(readResource)));
  }


  getTexts(index: number = 0): Observable<Text[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#>
CONSTRUCT {
  ?text knora-api:isMainResource true .
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
          readResources.map(r => {
            return new Text(r, this.kuiConfig);
          })
        ) 
      );
      
  }

  getText(iri: string): Observable<Text> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(map((readResource: ReadResource) => new Text(readResource, this.kuiConfig)));
  }


}