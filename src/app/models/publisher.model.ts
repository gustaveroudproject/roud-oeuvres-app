import { KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface PublisherLight extends Resource {  
  name: string;
  location: string;
}
export interface Publisher extends PublisherLight {  
  notice: string;
}