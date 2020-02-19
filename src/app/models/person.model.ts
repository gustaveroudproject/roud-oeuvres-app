import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface PersonLight extends Resource {
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
