import { Injectable } from '@angular/core';
import { KnoraApiConfig, KnoraApiConnection, ReadResource } from '@knora/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Person } from '../models/person.model';
import { Thing } from '../models/thing.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  knoraApiConnection: KnoraApiConnection;

  constructor() {
    const config: KnoraApiConfig = new KnoraApiConfig(
      environment.knoraApiProtocol as 'http' | 'https',
      environment.knoraApiHost
    );
    this.knoraApiConnection = new KnoraApiConnection(config);
  }

  getPersons(index: number = 0): Observable<Person[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#>
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
          readResources.map(r => new Person(r))
        )
      );
  }

  getPerson(iri: string): Observable<Person> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(map((readResource: ReadResource) => new Person(readResource)));
  }

  getThings(): Observable<Thing[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX any: <http://${environment.knoraApiHost}/ontology/0001/anything/v2#>
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
}
