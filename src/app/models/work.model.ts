import { Resource } from './resource.model';

export interface WorkLight extends Resource {
  title: string;
  authorValue: string;
  authorsValues: string[];
  date: string;
}
export interface Work extends WorkLight {
  notice: string;
}
