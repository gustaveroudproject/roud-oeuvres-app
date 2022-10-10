import { Resource } from './resource.model';

export interface TextLight extends Resource {
  title: string;
  editorialSet: string;
  date: string;
}
export interface Text extends TextLight {
  establishedText: string;
  baseWitMs: string;
  baseWitPub: string;
}
