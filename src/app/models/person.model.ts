import { Resource } from './resource.model';

export interface PersonLight extends Resource {  //pour construire une personne
  surname: string;
  name: string;
}

export interface PersonSemiLight extends PersonLight {
  notice: string;
}

export interface Person extends PersonSemiLight {
  dateOfBirth: string;
  dateOfDeath: string;
  DhsID: string;
  Viaf: string;
}


export interface Entity {
  id: string;
  photo: string;
}