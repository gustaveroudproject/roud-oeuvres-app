import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface TextLight extends Resource {
  title: string;
}
export interface Text extends TextLight {
  establishedText: string;
  // imageURL: string;
}
