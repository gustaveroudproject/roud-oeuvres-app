import { Resource } from './resource.model';

export interface PageLight extends Resource {
    seqnum: string;
    name: string;
    imageURL: string;
}

export interface Page extends PageLight {
    pageMs: string;
    pagePub: string;
}

export interface BookPart {
    title: string;
    startingPageSeqnum: string;
}