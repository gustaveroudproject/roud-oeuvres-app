import { KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface PeriodicalLight extends Resource {  
  title: string;
}
export interface Periodical extends PeriodicalLight {
  notice: string;
}
