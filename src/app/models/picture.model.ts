import { Resource } from './resource.model';

export interface Picture extends Resource {
    imageURL: string;
    title: string;
    shelfmark: string;
}
