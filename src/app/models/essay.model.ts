import { Resource } from './resource.model';

export interface EssayLight extends Resource {
  title: string;
  author: string;
}
export interface Essay extends EssayLight {
  textContent: string;
  photos: string[];
  scans: string[];
  biblios: string[];
}
