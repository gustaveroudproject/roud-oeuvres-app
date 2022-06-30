import { Resource } from './resource.model';

export interface PersonLight extends Resource {  //pour construire une personne
  surname: string;
  name: string;
}
export interface Person extends PersonLight {
  dateOfBirth: string;
  dateOfDeath: string;
  notice: string;
  DhsID: string;
  Viaf: string;
}
