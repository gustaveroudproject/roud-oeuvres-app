import { Resource } from './resource.model';

export interface MsLight extends Resource {  
  archive: string;
  shelfmark: string;
  title: string;
}

export interface Manuscript extends MsLight {
  documentType: string;
  editorialSet: string;
  supportType: string;
  supportInfo: string;
  writingTool: string;
  writingColor: string;
  otherWritingTool: string;
  annotations: string;
  geneticStage: string;
  dateReadable: string;
  dateComputable: string;
  establishedDateReadable: string;
  establishedDateComputable: string;
  establishedDateAdd: string;
  comment: string;
  isReusedInDossierValue: string;
  isReusedInDossierPartValue: string;
  isAvantTextInValue: string;
  isAvantTextInPartValue: string;
}

export interface MsPartLight extends Resource {  
  title: string;
  isPartOfMsValue: string;
  number: string;
}

export interface MsPartLightWithStartingPageSeqnum extends MsPartLight {  
  startingPageSeqnum: string;
}


export interface MsPart extends MsPartLight {  
  isReusedInValue: string;
  isRewrittenInMsValue: string;
  isRewrittenInMsPartValue: string;
}
