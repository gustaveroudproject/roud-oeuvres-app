import { KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface TextLight extends Resource {
  title: string;
  editorialSet: string;
}
export interface Text extends TextLight {
  establishedText: string;
  baseWitMs: string;
  baseWitPub: string;
  comment: string;
}
