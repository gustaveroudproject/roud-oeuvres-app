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
  lat: any; 
  /* gives error with NUMBER (because it arrives as string,
    even if it is defined as Decimal in the ontology, probably because the Salsah-gui element
    associated to Decimal is SimpleText)
    and it gives error with STRING, because the map wants numbers.
    So ANY !
    */
  long: any; // same as lat
  notice: string;
}
