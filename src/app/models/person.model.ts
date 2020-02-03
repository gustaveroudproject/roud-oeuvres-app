import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import { KnoraApiConnectionToken, KuiConfigToken, KuiConfig } from '@knora/core';

export class Person extends Resource {
  constructor( 
    readResource: ReadResource,

    @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
    @Inject(KuiConfigToken) private kuiConfig: KuiConfig) {
      super(readResource);
  }

  getOntoPrefixPath() {
    return `${this.kuiConfig.knora.apiProtocol}://${this.kuiConfig.knora.apiHost}:${this.kuiConfig.knora.apiPort}`;
  }


  get surname(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#personHasFamilyName`
    );
  }

  get name(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#personHasGivenName`
    );
  }

  get dateOfBirth(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#hasBirthDate`
    );
  } 

  get dateOfDeath(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#hasDeathDate`
    );
  } 

  get notice(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#personHasNotice`
    );
  } 

  get DhsID(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#personHasDhsID`
    );
  } 

  get Viaf(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#personHasAuthorityID`
    );
  } 

  


//  get imageURL(): string {
//    return this.getFirstValueAsStringOrNullOfProperty(
//      `http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue`
//    );
//  }

}
