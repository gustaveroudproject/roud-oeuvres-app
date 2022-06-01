import { KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface PersonLight extends Resource {  //pour construire une personne
  surname: string;
  name: string;
}
export interface Person extends PersonLight {
  dateOfBirth: string;
  dateOfDeath: string;
  notice: string;
  DhsID: string;
  Viaf: string;
}
