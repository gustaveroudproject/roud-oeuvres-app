import { Resource } from './resource.model';

export interface Page extends Resource {
    seqnum: string;
    imageURL: string;
}