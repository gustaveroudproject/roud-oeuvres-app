import { Injectable } from '@angular/core';
import {
  ApiResponseError,
  KnoraApiConfig,
  KnoraApiConnection,
  ReadResource
} from '@knora/api';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  getThings(): Observable<ReadResource[] | ApiResponseError> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX any: <http://${environment.knoraApiHost}/ontology/0001/anything/v2#>

CONSTRUCT {
  ?thing knora-api:isMainResource true .
} WHERE {
  ?thing a any:Thing .
}`;
    return this.knoraApiConnection.v2.search.doExtendedSearch(gravsearchQuery);
  }
}
