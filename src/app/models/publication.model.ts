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
  periodicalValue: string;
  issue: string;
  volume: string;
  pages: string; 
}

export interface Book extends Publication {
  publisherValue: string;
  editionNumber: string;
  // numberOfVolumes: string; no corresponding data
  // specificPages: string;  not relevant for web application
}

export interface BookSection extends Publication {
  publisherValue: string;
  book: string;
  pages: string;
  volume: string;
}
