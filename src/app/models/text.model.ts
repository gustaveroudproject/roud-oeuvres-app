import { Resource } from './resource.model';

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
