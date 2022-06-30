import { Resource } from './resource.model';

export interface AuthorLight extends Resource {  
  surname: string;
  name: string;
}
export interface Author extends AuthorLight {
  DhsID: string;
  Viaf: string;
}
