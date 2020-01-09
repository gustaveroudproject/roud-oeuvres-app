import { ReadResource } from '@knora/api';
import { environment } from 'src/environments/environment';
import { Resource } from './resource.model';

export class Person extends Resource {
  constructor(protected readResource: ReadResource) {
    super(readResource);
  }

  get surname(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#personHasFamilyName`
    );
  }

  get name(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#personHasGivenName`
    );
  }

  get dateOfBirth(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#hasBirthDate`
    );
  } 

  get dateOfDeath(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#hasDeathDate`
    );
  } 

  get notice(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#personHasNotice`
    );
  } 

  get DhsID(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#personHasDhsID`
    );
  } 

  get Viaf(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `http://${environment.knoraApiHost}/ontology/0112/roud-oeuvres/v2#personHasAuthorityID`
    );
  } 

  


//  get imageURL(): string {
//    return this.getFirstValueAsStringOrNullOfProperty(
//      `http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue`
//    );
//  }

}
