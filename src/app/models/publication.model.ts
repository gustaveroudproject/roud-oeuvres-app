import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Resource } from './resource.model';
import { Inject } from '@angular/core';
import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';

export interface PublicationLight extends Resource {  //pour construire une publication
  authorValue: string;
  title: string;
  date: string; // ??
}

export interface Publication extends PublicationLight {
  collaborators: string;
  isReusedIn: string;
}

export interface PeriodicalArticle extends Publication {
  periodical: string;
  issue: string;
  volume: string;
  pages: string; // ??
}
