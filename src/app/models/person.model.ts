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
}
export interface Person extends PersonLight {
  name: string;
  dateOfBirth: string;
  dateOfDeath: string;
  notice: string;
  DhsID: string;
  Viaf: string;
}
