import { ReadResource } from '@knora/api';
import { environment } from 'src/environments/environment';
import { Resource } from './resource.model';

export class Thing extends Resource {
  constructor(protected readResource: ReadResource) {
    super(readResource);
  }




//  get imageURL(): string {
//    return this.getFirstValueAsStringOrNullOfProperty(
//      `http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue`
//    );
//  }

}
