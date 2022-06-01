import { KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface AuthorLight extends Resource {  
  surname: string;
  name: string;
}
export interface Author extends AuthorLight {
  DhsID: string;
  Viaf: string;
}
