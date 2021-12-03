import { Resource } from './resource.model';

export interface EssayLight extends Resource {
  title: string;
  author: string;
  photos: string[];
}
export interface Essay extends EssayLight {
  textContent: string;
  scans: string[];
  biblios: string[];
}
