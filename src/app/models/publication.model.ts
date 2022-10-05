import { BookPart } from './page.model';
import { Resource } from './resource.model';

export interface PublicationLight extends Resource {  //pour construire une publication
  authorValue: string;
  authorsValues: string[];
  title: string;
  date: string;
  editorialSet: string;
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


export interface PubPartLight extends Resource, BookPart {  
  title: string;
  isPartOfPubValue: string;
  number: string;
}

export interface PubPart extends PubPartLight {  
  startingPageValue: string; 
  isReusedInValue: string;
}