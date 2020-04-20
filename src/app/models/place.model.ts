import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface PlaceLight extends Resource {  //pour construire un lieu
  name: string;
}
export interface Place extends PlaceLight {
  lat: string; // or integer?
  long: string;
  notice: string;
}
