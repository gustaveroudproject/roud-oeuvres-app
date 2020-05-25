import { Resource } from './resource.model';

export interface Page extends Resource {
    seqnum: string;
    name: string;
    imageURL: string;
}