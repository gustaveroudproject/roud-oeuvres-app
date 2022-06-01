import { Resource } from './resource.model';

export interface PublisherLight extends Resource {  
  name: string;
  location: string;
}
export interface Publisher extends PublisherLight {  
  notice: string;
}