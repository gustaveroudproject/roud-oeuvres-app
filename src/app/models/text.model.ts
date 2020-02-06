import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import { KnoraApiConnectionToken, KuiConfigToken, KuiConfig } from '@knora/core';

export class Text extends Resource {
  constructor( 
    readResource: ReadResource,
    private kuiConfig: KuiConfig)  {  // private create an attribute in the class
      super(readResource);
  }

  getOntoPrefixPath() {
    return `${this.kuiConfig.knora.apiProtocol}://${this.kuiConfig.knora.apiHost}:${this.kuiConfig.knora.apiPort}`;
  }


  get title(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#establishedTextHasTitle`
    );
  }

  get establishedText(): string {
    return this.getFirstValueAsStringOrNullOfProperty(
      `${this.getOntoPrefixPath()}/ontology/0112/roud-oeuvres/v2#hasTextContent`
    );
  }
  


//  get imageURL(): string {
//    return this.getFirstValueAsStringOrNullOfProperty(
//      `http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue`
//    );
//  }

}
