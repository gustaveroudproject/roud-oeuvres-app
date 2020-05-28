import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface MsLight extends Resource {  
  archive: string;
  shelfmark: string;
  title: string;
  isReusedInValue: string;
  isAvantTextInValue: string;
  isAvantTextInPartValue: string;
}


export interface MsPartLight extends Resource {  
  title: string;
  isPartOfMsValue: string;
  number: string;
  startingPageValue: string;
}

export interface MsPart extends MsPartLight {  
  isReusedInValue: string;
  isRewrittenInMsValue: string;
  isRewrittenInMsPartValue: string;
}
