import { Injectable, Inject } from '@angular/core';
import { KnoraApiConnection, ReadResource } from '@knora/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Person, PersonLight } from '../models/person.model';
import { Resource } from '../models/resource.model';
import { Text, TextLight } from '../models/text.model';
import { Page } from '../models/page.model';
import { Picture } from '../models/picture.model';
import { Place, PlaceLight } from '../models/place.model';
import { PublicationLight, Publication, PeriodicalArticle, Book, BookSection, PubPartLight, PubPart } from '../models/publication.model';
import { AuthorLight } from '../models/author.model';
import { PeriodicalLight, Periodical } from '../models/periodical.model';
import { PublisherLight } from '../models/publisher.model';
import { MsLight, MsPartLight, Manuscript } from '../models/manuscript.model';
import { Work } from '../models/work.model';
import { Essay, EssayLight } from '../models/essay.model';

import {
  KnoraApiConnectionToken,
  KuiConfigToken,
  KuiConfig
} from '@knora/core';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(
    @Inject(KnoraApiConnectionToken)
    private knoraApiConnection: KnoraApiConnection,
    @Inject(KuiConfigToken) private kuiConfig: KuiConfig
  ) {}

  getProjectIRI() {
    return 'http://rdfh.ch/projects/0112';
  }

  getOntoPrefixPath() {
    return `${this.kuiConfig.knora.apiProtocol}://${this.kuiConfig.knora.apiHost}${this.kuiConfig.knora.apiPort?":"+this.kuiConfig.knora.apiPort:""}/ontology/0112/roud-oeuvres/v2#`;
  }

  fullTextSearch(searchText: string, offset = 0): Observable<Resource[]> {   //offset = 0, only first page
    return this.knoraApiConnection.v2.search
      .doFulltextSearch(searchText, offset, {
        limitToProject: this.getProjectIRI()
      })
      .pipe(
        map((
          readResources: ReadResource[] // map = je transforme quelque chose en quelque chose
        ) => readResources.map(r => this.readRes2Resource(r)))
      );
  }

// DELETE THIS IF NOT USED
  getPagesOfText(textIRI: string, index: number = 0): Observable<Page[]> {  //Observable va retourner table of Pages
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?fac knora-api:isMainResource true .
  ?fac roud-oeuvres:hasSeqnum ?seqnum .
  ?fac knora-api:hasStillImageFileValue ?imageURL .
} WHERE {
  ?fac a roud-oeuvres:Page .
  ?fac roud-oeuvres:pageIsPartOfManuscript ?man .
  <${textIRI}> roud-oeuvres:hasDirectSourceManuscript ?man .
  ?fac roud-oeuvres:hasSeqnum ?seqnum .
  ?fac knora-api:hasStillImageFileValue ?imageURL .
}
ORDER BY ?seqnum
OFFSET ${index}
`
;
  return this.knoraApiConnection.v2.search
    .doExtendedSearch(gravsearchQuery)
    .pipe(
      map((
        readResources: ReadResource[] 
      ) => readResources.map(r => {
          return this.readRes2Page(r);
        })
      )
    );
}




getPagesOfPub(IRI: string, index: number = 0): Observable<Page[]> {  //Observable va retourner table of Pages
  const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
?fac knora-api:isMainResource true .
?fac roud-oeuvres:hasSeqnum ?seqnum .
?fac roud-oeuvres:pageHasName ?name .
?fac knora-api:hasStillImageFileValue ?imageURL .
} WHERE {
?fac a roud-oeuvres:Page .
?fac roud-oeuvres:pageIsPartOfPublication <${IRI}> .
?fac roud-oeuvres:hasSeqnum ?seqnum .
?fac roud-oeuvres:pageHasName ?name .
?fac knora-api:hasStillImageFileValue ?imageURL .
}
ORDER BY ?seqnum
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2Page(r);
      })
    )
  );
}


getPagesOfMs(IRI: string, index: number = 0): Observable<Page[]> {  //Observable va retourner table of Pages
  const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
?fac knora-api:isMainResource true .
?fac roud-oeuvres:hasSeqnum ?seqnum .
?fac roud-oeuvres:pageHasName ?name .
?fac knora-api:hasStillImageFileValue ?imageURL .
} WHERE {
?fac a roud-oeuvres:Page .
?fac roud-oeuvres:pageIsPartOfManuscript <${IRI}> .
?fac roud-oeuvres:hasSeqnum ?seqnum .
?fac roud-oeuvres:pageHasName ?name .
?fac knora-api:hasStillImageFileValue ?imageURL .
}
ORDER BY ?seqnum
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2Page(r);
      })
    )
  );
}




getPage(iri: string): Observable<Page> {
  return this.knoraApiConnection.v2.res
    .getResource(iri)
    .pipe(
      map((readResource: ReadResource) => this.readRes2Page(readResource))
    );
}



getPicturesOfPerson(personIRI: string, index: number = 0): Observable<Picture[]> {  //Observable va retourner table of Pictures
  const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
?pic knora-api:isMainResource true .
?pic roud-oeuvres:photoHasTitle ?title .
?pic knora-api:hasStillImageFileValue ?imageURL .
} WHERE {
?pic a roud-oeuvres:Photo .
<${personIRI}> roud-oeuvres:personHasPhoto ?pic .
?pic roud-oeuvres:photoHasTitle ?title .
?pic knora-api:hasStillImageFileValue ?imageURL .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2Picture(r);
      })
    )
  );
}


getPicturesOfPlace(placeIRI: string, index: number = 0): Observable<Picture[]> {  //Observable va retourner table of Persons
  const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
?pic knora-api:isMainResource true .
?pic roud-oeuvres:photoHasTitle ?title .
?pic knora-api:hasStillImageFileValue ?imageURL .
} WHERE {
?pic a roud-oeuvres:Photo .
<${placeIRI}> roud-oeuvres:placeHasPhoto ?pic .
?pic roud-oeuvres:photoHasTitle ?title .
?pic knora-api:hasStillImageFileValue ?imageURL .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2Picture(r);
      })
    )
  );
}




getPicture(iri: string): Observable<Picture> {
  return this.knoraApiConnection.v2.res
    .getResource(iri)
    .pipe(
      map((readResource: ReadResource) => this.readRes2Picture(readResource))
    );
}






  getPersonsInText(textIRI: string, index: number = 0): Observable<PersonLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?Person knora-api:isMainResource true .
    ?Person roud-oeuvres:personHasFamilyName ?surname .
    ?Person roud-oeuvres:personHasGivenName ?name .
} WHERE {
    ?Person a roud-oeuvres:Person .
    ?Person roud-oeuvres:personHasFamilyName ?surname .
    ?Person roud-oeuvres:personHasGivenName ?name .
    <${textIRI}> knora-api:hasStandoffLinkTo ?Person .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PersonLight(r);
      })
    )
  );
}


getPlacesInText(textIRI: string, index: number = 0): Observable<PlaceLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?place knora-api:isMainResource true .
    ?place roud-oeuvres:placeHasName ?name .
} WHERE {
    ?place a roud-oeuvres:Place .
    ?place roud-oeuvres:placeHasName ?name .
    <${textIRI}> knora-api:hasStandoffLinkTo ?place .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PlaceLight(r);
      })
    )
  );
}



getTextsInText(textIRI: string, index: number = 0): Observable<TextLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?text knora-api:isMainResource true .
    ?text roud-oeuvres:establishedTextHasTitle ?title .
} WHERE {
    ?text a roud-oeuvres:EstablishedText .
    ?text roud-oeuvres:establishedTextHasTitle ?title .
    <${textIRI}> knora-api:hasStandoffLinkTo ?text .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2TextLight(r);
      })
    )
  );
}



getPubsInText(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pub knora-api:isMainResource true .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
    ?pub a roud-oeuvres:Publication .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
    <${textIRI}> knora-api:hasStandoffLinkTo ?pub .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}



getMssInText(textIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?ms knora-api:isMainResource true .
    ?ms roud-oeuvres:manuscriptIsInArchive ?archive .
    ?ms roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?ms roud-oeuvres:manuscriptHasTitle ?title .
} WHERE {
    ?ms a roud-oeuvres:Manuscript .
    ?ms roud-oeuvres:manuscriptIsInArchive ?archive .
    ?ms roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?ms roud-oeuvres:manuscriptHasTitle ?title .
    <${textIRI}> knora-api:hasStandoffLinkTo ?ms .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}



getWorksInText(textIRI: string, index: number = 0): Observable<Work[]> {  
  const gravsearchQuery = `

  PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
  PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
  CONSTRUCT {
      ?work knora-api:isMainResource true .
      ?work roud-oeuvres:workHasTitle ?title .
      ?work roud-oeuvres:workHasAuthor ?authorValue .
      ?work roud-oeuvres:workHasDate ?date .
      ?work roud-oeuvres:workHasNotice ?notice .
  } WHERE {
    ?work a roud-oeuvres:Work .
    <${textIRI}> knora-api:hasStandoffLinkTo ?work .
      {
        ?work roud-oeuvres:workHasTitle ?title .
        ?work roud-oeuvres:workHasAuthor ?authorValue .
        ?work roud-oeuvres:workHasDate ?date .
      }
      UNION
      {
        ?work roud-oeuvres:workHasTitle ?title .
        ?work roud-oeuvres:workHasAuthor ?authorValue .
        ?work roud-oeuvres:workHasDate ?date .
        ?work roud-oeuvres:workHasNotice ?notice .
      }
  }
  OFFSET ${index}
`
// don't understand why order by multiplies results?!
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2Work(r);
      })
    )
  );
}




getTextsMentioningPersons(textIRI: string, index: number = 0): Observable<TextLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?Text knora-api:isMainResource true .
    ?Text roud-oeuvres:establishedTextHasTitle ?title .
} WHERE {
    ?Text a roud-oeuvres:EstablishedText .
    ?Text roud-oeuvres:establishedTextHasTitle ?title .
    ?Text knora-api:hasStandoffLinkTo <${textIRI}> .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2TextLight(r);
      })
    )
  );
}



getTextsMentioningPlaces(textIRI: string, index: number = 0): Observable<TextLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?Text knora-api:isMainResource true .
    ?Text roud-oeuvres:establishedTextHasTitle ?title .
} WHERE {
    ?Text a roud-oeuvres:EstablishedText .
    ?Text roud-oeuvres:establishedTextHasTitle ?title .
    ?Text knora-api:hasStandoffLinkTo <${textIRI}> .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2TextLight(r);
      })
    )
  );
}


getPartsLightOfPub(textIRI: string, index: number = 0): Observable<PubPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pubPart knora-api:isMainResource true .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} WHERE {
    ?pubPart a roud-oeuvres:PubPart .
    ?pubPart roud-oeuvres:pubPartIsPartOf <${textIRI}> .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} ORDER BY ASC(?number)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPartLight(r);
      })
    )
  );
}


getPartsOfPub(textIRI: string, index: number = 0): Observable<PubPart[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pubPart knora-api:isMainResource true .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
    ?pubPart roud-oeuvres:pubPartHasStartingPage ?startingPageValue .    
} WHERE {
    ?pubPart a roud-oeuvres:PubPart .
    ?pubPart roud-oeuvres:pubPartIsPartOf <${textIRI}> .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
    ?pubPart roud-oeuvres:pubPartHasStartingPage ?startingPageValue .
} ORDER BY ASC(?number)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPart(r);
      })
    )
  );
}


getStartingPageOfPart(iri: string): Observable<Page> {
  return this.knoraApiConnection.v2.res
    .getResource(iri)
    .pipe(
      map((readResource: ReadResource) => this.readRes2Page(readResource))
    );
}



getAvantTexts(textIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?ms knora-api:isMainResource true .
    ?ms roud-oeuvres:msIsAvantTextInGeneticDossier ?dossier .
    ?ms roud-oeuvres:manuscriptHasTitle ?title .
    ?ms roud-oeuvres:manuscriptIsInArchive ?archive .
    ?ms roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
} WHERE {
    ?ms a roud-oeuvres:Manuscript .
    ?ms roud-oeuvres:msIsAvantTextInGeneticDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication <${textIRI}> .
    ?ms roud-oeuvres:manuscriptHasTitle ?title .
    ?ms roud-oeuvres:manuscriptIsInArchive ?archive .
    ?ms roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}


getAvantTextsParts(textIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?ms knora-api:isMainResource true .
    ?ms roud-oeuvres:msIsAvantTextInGeneticDossierPart ?dossierPart .
    ?ms roud-oeuvres:manuscriptHasTitle ?title .
    ?ms roud-oeuvres:manuscriptIsInArchive ?archive .
    ?ms roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
} WHERE {
    ?ms a roud-oeuvres:Manuscript .
    ?ms roud-oeuvres:msIsAvantTextInGeneticDossierPart ?dossierPart .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart <${textIRI}> .
    ?ms roud-oeuvres:manuscriptHasTitle ?title .
    ?ms roud-oeuvres:manuscriptIsInArchive ?archive .
    ?ms roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}


getPublicationsReusedInPublication(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pub knora-api:isMainResource true .
    ?pub roud-oeuvres:publicationIsReusedInDossier ?dossier .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
    ?pub a roud-oeuvres:Publication .
    ?pub roud-oeuvres:publicationIsReusedInDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication <${textIRI}> .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}



getPublicationPartsReusedInPublication(textIRI: string, index: number = 0): Observable<PubPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pubPart knora-api:isMainResource true .
    ?pubPart roud-oeuvres:pubPartIsReusedInDossier ?dossier .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} WHERE {
    ?pubPart a roud-oeuvres:PubPart .
    ?pubPart roud-oeuvres:pubPartIsReusedInDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication <${textIRI}> .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPartLight(r);
      })
    )
  );
}


getPublicationsRepublishedInPublication(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pub knora-api:isMainResource true .
    ?pub roud-oeuvres:publicationIsRepublishedDossier ?dossier .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
    ?pub a roud-oeuvres:Publication .
    ?pub roud-oeuvres:publicationIsRepublishedDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication <${textIRI}> .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}



getPubOfPubPart(iri: string): Observable<PublicationLight> {
  return this.knoraApiConnection.v2.res
    .getResource(iri)
    .pipe(
      map((readResource: ReadResource) => this.readRes2PublicationLight(readResource))
    );
}


getPublicationsReusedInPubPart(pubPartIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pub knora-api:isMainResource true .
    ?pub roud-oeuvres:publicationIsReusedInDossierPart ?dossierPart .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
    ?pub a roud-oeuvres:Publication .
    ?pub roud-oeuvres:publicationIsReusedInDossierPart ?dossierPart .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart <${pubPartIRI}> .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}



getPublicationPartsReusedInPubPart(pubPartIRI: string, index: number = 0): Observable<PubPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pubPart knora-api:isMainResource true .
    ?pubPart roud-oeuvres:pubPartIsReusedInDossierPart ?dossierPart .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} WHERE {
    ?pubPart a roud-oeuvres:PubPart .
    ?pubPart roud-oeuvres:pubPartIsReusedInDossierPart ?dossierPart .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart <${pubPartIRI}> .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPartLight(r);
      })
    )
  );
}



getPublicationsReusingPublication(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pub knora-api:isMainResource true .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
    ?pub a roud-oeuvres:Publication .
    <${textIRI}> roud-oeuvres:publicationIsReusedInDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}


getPublicationPartsReusingPublication(pubIRI: string, index: number = 0): Observable<PubPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pubPart knora-api:isMainResource true .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} WHERE {
    ?pubPart a roud-oeuvres:PubPart .
    <${pubIRI}> roud-oeuvres:publicationIsReusedInDossierPart ?dossierPart .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPartLight(r);
      })
    )
  );
}



getPublicationsReusingPubPart(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pub knora-api:isMainResource true .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
    ?pub a roud-oeuvres:Publication .
    <${textIRI}> roud-oeuvres:pubPartIsReusedInDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
} ORDER BY ASC(?date)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}


getPublicationPartsReusingPubPart(pubPartIRI: string, index: number = 0): Observable<PubPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pubPart knora-api:isMainResource true .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} WHERE {
    ?pubPart a roud-oeuvres:PubPart .
    <${pubPartIRI}> roud-oeuvres:pubPartIsReusedInDossierPart ?dossierPart .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPartLight(r);
      })
    )
  );
}



getPublicationsRepublishingPublication(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pub knora-api:isMainResource true .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
    ?pub a roud-oeuvres:Publication .
    <${textIRI}> roud-oeuvres:publicationIsRepublishedDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
    ?pub roud-oeuvres:publicationHasTitle ?title .
    ?pub roud-oeuvres:publicationHasDate ?date .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}





getPubsReusingDiary(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?pub knora-api:isMainResource true .
  ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
  ?pub roud-oeuvres:publicationHasTitle ?title .
  ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
  ?pub a roud-oeuvres:Publication .
  <${textIRI}> roud-oeuvres:msIsReusedInDossier ?dossier .
  ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
  ?pub roud-oeuvres:publicationHasTitle ?title .
  ?pub roud-oeuvres:publicationHasDate ?date .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}





getPubPartsReusingDiary(textIRI: string, index: number = 0): Observable<PubPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?pubPart knora-api:isMainResource true .
  ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
  ?pubPart roud-oeuvres:pubPartHasTitle ?title .
  ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
  ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} WHERE {
  ?pubPart a roud-oeuvres:PubPart .
  <${textIRI}> roud-oeuvres:msIsReusedInDossierPart ?dossierPart .
  ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
  ?pubPart roud-oeuvres:pubPartHasTitle ?title .
  ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
  ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPartLight(r);
      })
    )
  );
}



getPublicationsReusingMsPart(msPartIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
  CONSTRUCT {
      ?pub knora-api:isMainResource true .
      ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
      ?pub roud-oeuvres:publicationHasTitle ?title .
      ?pub roud-oeuvres:publicationHasDate ?date .
  } WHERE {
      ?pub a roud-oeuvres:Publication .
      <${msPartIRI}> roud-oeuvres:msPartIsReusedInDossier ?dossier .
      ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
      ?pub roud-oeuvres:publicationHasTitle ?title .
      ?pub roud-oeuvres:publicationHasDate ?date .
  } ORDER BY ASC(?date)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}



getPublicationPartsReusingMsPart(msPartIRI: string, index: number = 0): Observable<PubPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?pubPart knora-api:isMainResource true .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
} WHERE {
    ?pubPart a roud-oeuvres:PubPart .
    <${msPartIRI}> roud-oeuvres:msPartIsReusedInDossierPart ?dossierPart .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
    ?pubPart roud-oeuvres:pubPartHasTitle ?title .
    ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
    ?pubPart roud-oeuvres:pubPartHasNumber ?number .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPartLight(r);
      })
    )
  );
}





getPubsReusingDiaryPart(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?pub knora-api:isMainResource true .
  ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
  ?pub roud-oeuvres:publicationHasTitle ?title .
  ?pub roud-oeuvres:publicationHasDate ?date .
} WHERE {
  ?pub a roud-oeuvres:Publication .
  <${textIRI}> roud-oeuvres:msIsReusedInDossier ?dossier .
  ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
  ?pub roud-oeuvres:publicationHasTitle ?title .
  ?pub roud-oeuvres:publicationHasDate ?date .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}



getMssReusedInPublication(textIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msLight knora-api:isMainResource true .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} WHERE {
    ?msLight a roud-oeuvres:Manuscript .
    ?msLight roud-oeuvres:msIsReusedInDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication <${textIRI}> .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}

getMsPartsReusedInPublication(textIRI: string, index: number = 0): Observable<MsPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msPart knora-api:isMainResource true .
    ?msPart roud-oeuvres:msPartIsReusedInDossier ?dossier .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} WHERE {
    ?msPart a roud-oeuvres:MsPart .
    ?msPart roud-oeuvres:msPartIsReusedInDossier ?dossier .
    ?dossier roud-oeuvres:geneticDossierResultsInPublication <${textIRI}> .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} ORDER BY ASC(?number)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsPartLight(r);
      })
    )
  );
}


getMssReusedInPubParts(pubPartIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msLight knora-api:isMainResource true .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} WHERE {
    ?msLight a roud-oeuvres:Manuscript .
    ?msLight roud-oeuvres:msIsReusedInDossierPart ?dossierPart .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart <${pubPartIRI}> .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}



getMsPartsReusedInPubParts(pubPartIRI: string, index: number = 0): Observable<MsPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msPart knora-api:isMainResource true .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} WHERE {
    ?msPart a roud-oeuvres:MsPart .
    ?msPart roud-oeuvres:msPartIsReusedInDossierPart ?dossierPart .
    ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart <${pubPartIRI}> .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsPartLight(r);
      })
    )
  );
}


getMsPartsFromMs(msIRI: string, index: number = 0): Observable<MsPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msPart knora-api:isMainResource true .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
} WHERE {
    ?msPart a roud-oeuvres:MsPart .
    ?msPart roud-oeuvres:msPartIsPartOf <${msIRI}> .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
} ORDER BY ASC(?number)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsPartLight(r);
      })
    )
  );
}





getMsOfMsPart(iri: string): Observable<MsLight> {
  return this.knoraApiConnection.v2.res
    .getResource(iri)
    .pipe(
      map((readResource: ReadResource) => this.readRes2MsLight(readResource))
    );
}



getMssRewritingMs(msIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msLight knora-api:isMainResource true .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} WHERE {
    ?msLight a roud-oeuvres:Manuscript .
    <${msIRI}> roud-oeuvres:msIsRewrittenInMs ?msLight .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}


getMsPartsRewritingMs(msIRI: string, index: number = 0): Observable<MsPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msPart knora-api:isMainResource true .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} WHERE {
    ?msPart a roud-oeuvres:MsPart .
    <${msIRI}> roud-oeuvres:msIsRewrittenInMsPart ?msPart .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} ORDER BY ASC(?number)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsPartLight(r);
      })
    )
  );
}


getManuscriptsRewritingMsPart(msPartIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msLight knora-api:isMainResource true .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} WHERE {
    ?msLight a roud-oeuvres:Manuscript .
    <${msPartIRI}> roud-oeuvres:msPartIsRewrittenInMs ?msLight .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}


getMsPartsRewritingMsPart(msPartIRI: string, index: number = 0): Observable<MsPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msPart knora-api:isMainResource true .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} WHERE {
    ?msPart a roud-oeuvres:MsPart .
    <${msPartIRI}> roud-oeuvres:msPartIsRewrittenInMsPart ?msPart .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} ORDER BY ASC(?number)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsPartLight(r);
      })
    )
  );
}


getMssRewrittenMs(msIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msLight knora-api:isMainResource true .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} WHERE {
    ?msLight a roud-oeuvres:Manuscript .
    ?msLight roud-oeuvres:msIsRewrittenInMs <${msIRI}> .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}


getMsPartsRewrittenMs(msIRI: string, index: number = 0): Observable<MsPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msPart knora-api:isMainResource true .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} WHERE {
    ?msPart a roud-oeuvres:MsPart .
    ?msPart roud-oeuvres:msPartIsRewrittenInMs <${msIRI}> .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} ORDER BY ASC(?number)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsPartLight(r);
      })
    )
  );
}


getManuscriptsRewrittenMsPart(msPartIRI: string, index: number = 0): Observable<MsLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msLight knora-api:isMainResource true .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} WHERE {
    ?msLight a roud-oeuvres:Manuscript .
    ?msLight roud-oeuvres:msIsRewrittenInMsPart <${msPartIRI}> .
    ?msLight roud-oeuvres:manuscriptIsInArchive ?archive .
    ?msLight roud-oeuvres:manuscriptHasShelfmark ?shelfmark .
    ?msLight roud-oeuvres:manuscriptHasTitle ?title .
} 
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsLight(r);
      })
    )
  );
}


getMsPartsRewrittenMsPart(msPartIRI: string, index: number = 0): Observable<MsPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
    ?msPart knora-api:isMainResource true .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} WHERE {
    ?msPart a roud-oeuvres:MsPart .
    ?msPart roud-oeuvres:msPartIsRewrittenInMsPart <${msPartIRI}> .
    ?msPart roud-oeuvres:msPartHasTitle ?title .
    ?msPart roud-oeuvres:msPartHasNumber ?number .
    ?msPart roud-oeuvres:msPartIsPartOf ?isPartOfMsValue .
} ORDER BY ASC(?number)
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2MsPartLight(r);
      })
    )
  );
}




getPublicationsWithThisAvantTexte(textIRI: string, index: number = 0): Observable<PublicationLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?pub knora-api:isMainResource true .
  ?pub roud-oeuvres:publicationHasTitle ?title .
  ?pub roud-oeuvres:publicationHasDate ?date .
  ?pubPart roud-oeuvres:pubPartIsPartOf ?pub .
} WHERE {
  ?pub a roud-oeuvres:Publication .
  ?pub roud-oeuvres:publicationHasTitle ?title .
  ?pub roud-oeuvres:publicationHasDate ?date .
  <${textIRI}> roud-oeuvres:msIsAvantTextInGeneticDossier ?dossier .
  ?dossier roud-oeuvres:geneticDossierResultsInPublication ?pub .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PublicationLight(r);
      })
    )
  );
}




getPublicationPartsWithThisAvantTexte(textIRI: string, index: number = 0): Observable<PubPartLight[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?pubPart knora-api:isMainResource true .
  ?pubPart roud-oeuvres:pubPartHasTitle ?title .
  ?pubPart roud-oeuvres:pubPartHasNumber ?number .
  ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
} WHERE {
  ?pubPart a roud-oeuvres:PubPart .
  ?pubPart roud-oeuvres:pubPartHasTitle ?title .
  ?pubPart roud-oeuvres:pubPartHasNumber ?number .
  <${textIRI}> roud-oeuvres:msIsAvantTextInGeneticDossierPart ?dossierPart .
  ?dossierPart roud-oeuvres:geneticDossierPartResultsInPubPart ?pubPart .
  ?pubPart roud-oeuvres:pubPartIsPartOf ?pubValue .
}
OFFSET ${index}
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2PubPartLight(r);
      })
    )
  );
}







  getPersonLights(index: number = 0): Observable<PersonLight[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?person knora-api:isMainResource true .
  ?person roud-oeuvres:personHasFamilyName ?surname .
  ?person roud-oeuvres:personHasGivenName ?name .
} WHERE {
  ?person a roud-oeuvres:Person .
  ?person roud-oeuvres:personHasFamilyName ?surname .
  ?person roud-oeuvres:personHasGivenName ?name .
} ORDER BY ASC(?surname)
OFFSET ${index}
`;
    return this.knoraApiConnection.v2.search
      .doExtendedSearch(gravsearchQuery) // cet appel, asynchrone, retourne readResource
      .pipe(
        // on se met au milieu de ce flux de données qui arrivent dans l'observable et transforme chaque donnée à la volé
        map((
          readResources: ReadResource[] // map = je transforme quelque chose en quelque chose
        ) =>
          // le suivant corréspond à
          // {
          //   const res = [];
          //   for(r in readResources) {
          //     res.push(this.readRes2Person(r))
          //   }
          //   return res;
          // }
          readResources.map(r => {
            return this.readRes2PersonLight(r);
          })
        )
      );
  }

  getMsLight(iri: string): Observable<MsLight> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2MsLight(readResource))
      );
  }

  
  getManuscript(iri: string): Observable<Manuscript> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Manuscript(readResource))
      );
  }
  


  

  /*
 getManuscript(textIRI: string): Observable<Manuscript[]> {  
  const gravsearchQuery = `

PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?ms knora-api:isMainResource true .
  ?ms roud-oeuvres:hasDocumentType ?documentType .
  ?ms roud-oeuvres:manuscriptHasEditorialSet ?editorialSet .
  ?ms roud-oeuvres:hasSupportType ?supportType .
  ?ms roud-oeuvres:hasSupportInfo ?supportInfo .
  ?ms roud-oeuvres:hasWritingTool ?writingTool .
  ?ms roud-oeuvres:hasOtherWritingTool ?otherWritingTool .
  ?ms roud-oeuvres:hasWritingColor ?writingColor .
  ?ms roud-oeuvres:hasAnnotation ?annotations .
  ?ms roud-oeuvres:manuscriptHasDateReadable ?dateReadable .
  ?ms roud-oeuvres:manuscriptHasDateComputable ?dateComputable .
  ?ms roud-oeuvres:manuscriptHasDateEstablishedReadable ?establishedDateReadable .
  ?ms roud-oeuvres:manuscriptHasDateEstablishedComputable ?establishedDateComputable .
  ?ms roud-oeuvres:manuscriptHasDateEstablishedList ?establishedDateAdd .
  ?ms roud-oeuvres:hasGeneticStage ?geneticStage .
  ?ms roud-oeuvres:hasPublicComment ?comment .
  
} WHERE {
  BIND(<${textIRI}> as ?ms)
  ?ms a roud-oeuvres:Manuscript .
  ?ms roud-oeuvres:hasDocumentType ?documentType .
  ?ms roud-oeuvres:manuscriptHasEditorialSet ?editorialSet .
  ?ms roud-oeuvres:hasSupportType ?supportType .
  ?ms roud-oeuvres:hasSupportInfo ?supportInfo .
  ?ms roud-oeuvres:hasWritingTool ?writingTool .
  ?ms roud-oeuvres:hasOtherWritingTool ?otherWritingTool .
  ?ms roud-oeuvres:hasWritingColor ?writingColor .
  ?ms roud-oeuvres:hasAnnotation ?annotations .
  ?ms roud-oeuvres:manuscriptHasDateReadable ?dateReadable .
  ?ms roud-oeuvres:manuscriptHasDateComputable ?dateComputable .
  ?ms roud-oeuvres:manuscriptHasDateEstablishedReadable ?establishedDateReadable .
  ?ms roud-oeuvres:manuscriptHasDateEstablishedComputable ?establishedDateComputable .
  ?ms roud-oeuvres:manuscriptHasDateEstablishedList ?establishedDateAdd .
  ?ms roud-oeuvres:hasGeneticStage ?geneticStage .
  ?ms roud-oeuvres:hasPublicComment ?comment .
} 
`
;
return this.knoraApiConnection.v2.search
  .doExtendedSearch(gravsearchQuery)
  .pipe(
    map((
      readResources: ReadResource[] 
    ) => readResources.map(r => {
        return this.readRes2Manuscript(r);
      })
    )
  );
}
*/






  getPerson(iri: string): Observable<Person> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Person(readResource))
      );
  }


  getPersons(iris: string[]): Observable<Person[]> {
    return this.knoraApiConnection.v2.res
      .getResources(iris)
      .pipe(
        map((readResources: ReadResource[]) => readResources.map(r => this.readRes2Person(r)))
      );
  }


  getAuthorLight(iri: string): Observable<AuthorLight> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2AuthorLight(readResource))
      );
  }







  getPlaceLights(index: number = 0): Observable<PlaceLight[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?place knora-api:isMainResource true .
  ?place roud-oeuvres:placeHasName ?name .
} WHERE {
  ?place a roud-oeuvres:Place .
  ?place roud-oeuvres:placeHasName ?name .
} ORDER BY ASC(?name)
OFFSET ${index}
`;
    return this.knoraApiConnection.v2.search
      .doExtendedSearch(gravsearchQuery) // cet appel, asynchrone, retourne readResource
      .pipe(
        // on se met au milieu de ce flux de données qui arrivent dans l'observable et transforme chaque donnée à la volé
        map((
          readResources: ReadResource[] // map = je transforme quelque chose en quelque chose
        ) =>
          // le suivant corréspond à
          // {
          //   const res = [];
          //   for(r in readResources) {
          //     res.push(this.readRes2Person(r))
          //   }
          //   return res;
          // }
          readResources.map(r => {
            return this.readRes2PlaceLight(r);
          })
        )
      );
  }

  getPlace(iri: string): Observable<Place> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Place(readResource))
      );
  }


  getPlaces(iris: string[]): Observable<Place[]> {
    return this.knoraApiConnection.v2.res
      .getResources(iris)
      .pipe(
        map((readResources: ReadResource[]) => readResources.map(r => this.readRes2Place(r)))
      );
  }


  getResource(iri: string): Observable<Resource> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Resource(readResource))
      );
  }



  getPublicationLight(iri: string): Observable<PublicationLight> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2PublicationLight(readResource))
      );
  }

  getPublication(iri: string): Observable<Publication> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Publication(readResource))
      );
  }

  getPeriodicalArticle(iri: string): Observable<PeriodicalArticle> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2PeriodicalArticle(readResource))
      );
  }

  getPeriodicalLight(iri: string): Observable<PeriodicalLight> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2PeriodicalLight(readResource))
      );
  }

  getBook(iri: string): Observable<Book> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Book(readResource))
      );
  }

  getBookSection(iri: string): Observable<BookSection> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2BookSection(readResource))
      );
  }

  getPublisherLight(iri: string): Observable<PublisherLight> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2PublisherLight(readResource))
      );
  }




  getTextLights(index: number = 0): Observable<TextLight[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?text knora-api:isMainResource true .
  ?text roud-oeuvres:establishedTextHasTitle ?title .
} WHERE {
  ?text a roud-oeuvres:EstablishedText .
  ?text roud-oeuvres:establishedTextHasTitle ?title .
} ORDER BY ASC(?title)
OFFSET ${index}
`;
    return this.knoraApiConnection.v2.search
      .doExtendedSearch(gravsearchQuery)
      .pipe(
        map((readResources: ReadResource[]) =>
          readResources.map(r => this.readRes2TextLight(r))
        )
      );
  }

  getText(iri: string): Observable<Text> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Text(readResource))
      );
  }

  
  getTexts(iris: string[]): Observable<Text[]> {
    return this.knoraApiConnection.v2.res
      .getResources(iris)
      .pipe(
        map((readResources: ReadResource[]) => readResources.map(r => this.readRes2Text(r)))
      );
  }






  getEssaysLight(index: number = 0): Observable<EssayLight[]> {
    const gravsearchQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/v2#>
PREFIX roud-oeuvres: <${this.getOntoPrefixPath()}>
CONSTRUCT {
  ?essayLight knora-api:isMainResource true .
  ?essayLight roud-oeuvres:essayHasTitle ?title .
  ?essayLight roud-oeuvres:essayHasAuthor ?author .
} WHERE {
  ?essayLight a roud-oeuvres:Essay .
  ?essayLight roud-oeuvres:essayHasTitle ?title .
  ?essayLight roud-oeuvres:essayHasAuthor ?author .
} ORDER BY ASC(?title)
OFFSET ${index}
`;
    return this.knoraApiConnection.v2.search
      .doExtendedSearch(gravsearchQuery)
      .pipe(
        map((readResources: ReadResource[]) =>
          readResources.map(r => this.readRes2EssayLight(r))
        )
      );
  }

  getEssay(iri: string): Observable<Essay> {
    return this.knoraApiConnection.v2.res
      .getResource(iri)
      .pipe(
        map((readResource: ReadResource) => this.readRes2Essay(readResource))
      );
  }

  
  getEssays(iris: string[]): Observable<Essay[]> {
    return this.knoraApiConnection.v2.res
      .getResources(iris)
      .pipe(
        map((readResources: ReadResource[]) => readResources.map(r => this.readRes2Essay(r)))
      );
  }




  readRes2Resource(readResource: ReadResource): Resource {
    return {
      id: readResource.id,
      ark: readResource.arkUrl,
      label: readResource.label,
      resourceClassLabel: readResource.resourceClassLabel
    } as Resource;
  }

  readRes2Page(readResource: ReadResource): Page {  
    return {
      ...this.readRes2Resource(readResource),
      seqnum: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasSeqnum`
      ),
      name: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}pageHasName`
      ),      imageURL: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue`
      )
    } as Page;   
  }


  readRes2Picture(readResource: ReadResource): Picture {  
    return {
      ...this.readRes2Resource(readResource),
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}photoHasTitle`
      ),
      imageURL: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `http://api.knora.org/ontology/knora-api/v2#hasStillImageFileValue`
      )
    } as Picture;   
  }



  readRes2MsLight(readResource: ReadResource): MsLight {  
    return {
      ...this.readRes2Resource(readResource),
      archive: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptIsInArchive`
      ),
      shelfmark: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptHasShelfmark`
      ), 
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptHasTitle`
      )
    } as MsLight;    
  }



  readRes2Manuscript(readResource: ReadResource): Manuscript {  
    return {
      ...this.readRes2MsLight(readResource),
      documentType: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasDocumentType`
      ),
      otherWritingTool: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasOtherWritingTool`
      ), 
      geneticStage: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasGeneticStage`
      ),
      establishedDateReadable: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptHasDateEstablishedReadable`
      ),
      supportType: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasSupportType`
      ),
      writingTool: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasWritingTool`
      ),
      establishedDateComputable: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptHasDateEstablishedComputable`
      ),
      comment: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasPublicComment`
      ),
      dateReadable: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptHasDateReadable`
      ),
      dateComputable: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptHasDateComputable`
      ),
      establishedDateAdd: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptHasDateEstablishedList`
      ),
      editorialSet: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}manuscriptHasEditorialSet`
      ),
      annotations: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasAnnotation`
      ),
      supportInfo: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasSupportInfo`
      ),
      writingColor: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasWritingColor`
      ),
      isReusedInDossierValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}msIsReusedInDossierValue`
      ),
      isReusedInDossierPartValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}msIsReusedInDossierPartValue`
      ),
      isAvantTextInValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}msIsAvantTextInGeneticDossierValue`
      ),
      isAvantTextInPartValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}msIsAvantTextInGeneticDossierPartValue`
      )
    } as Manuscript;    
  }


  readRes2PubPartLight(readResource: ReadResource): PubPartLight {  
    return {
      ...this.readRes2Resource(readResource),
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}pubPartHasTitle`
      ),
      isPartOfPubValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}pubPartIsPartOfValue`
      ),
      number: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}pubPartHasNumber`
      )
    } as PubPartLight;    
  }


  

  readRes2PubPart(readResource: ReadResource): PubPart {  
    return {
      ...this.readRes2PubPartLight(readResource),
      startingPageValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}pubPartHasStartingPageValue`
      ),
      isReusedInValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}pubPartIsReusedInValue`
      )
    } as PubPart;    
  }


  readRes2MsPartLight(readResource: ReadResource): MsPartLight {  
    return {
      ...this.readRes2Resource(readResource),
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}msPartHasTitle`
      ),
      isPartOfMsValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}msPartIsPartOfValue`
      ),
      number: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}msPartHasNumber`
      ),
      startingPageValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}msPartHasStartingPageValue`
      )
    } as MsPartLight;    
  }

  readRes2PublicationLight(readResource: ReadResource): PublicationLight {  
    return {
      ...this.readRes2Resource(readResource),
      authorsValues: this.getArrayOfValues(
        readResource,
        `${this.getOntoPrefixPath()}publicationHasAuthorValue`
      ),
      
      authorValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}publicationHasAuthorValue`
      ), 
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}publicationHasTitle`
      ),
      date: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}publicationHasDate`
      )
    } as PublicationLight;    
  }

  readRes2Publication(readResource: ReadResource): Publication {  
    return {
      ...this.readRes2PublicationLight(readResource),
      collaborators: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasCollaborators`
      ),
      isReusedIn: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}publicationIsReusedInDossierValue`
      )
    } as Publication;    
  }


  readRes2PeriodicalArticle(readResource: ReadResource): PeriodicalArticle {  
    return {
      ...this.readRes2Publication(readResource),
      periodicalValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}isPublishedInPeriodicalValue`
      ),
      issue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}isInPeriodicalIssue`
      ),
      volume: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}isInPeriodicalVolume`
      ),
      pages: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}periodicalArticleIsInPages`
      )
    } as PeriodicalArticle;    
  }


  readRes2PeriodicalLight(readResource: ReadResource): PeriodicalLight {  
    return {
      ...this.readRes2Resource(readResource),
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}periodicalHasTitle`
      )
    } as PeriodicalLight;    
  }

  readRes2Periodical(readResource: ReadResource): Periodical {  
    return {
      ...this.readRes2PeriodicalLight(readResource),
      notice: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}periodicalHasNotice`
      )
    } as Periodical;    
  }

  readRes2Book(readResource: ReadResource): Book {  
    return {
      ...this.readRes2Publication(readResource),
      publisherValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasPublisherValue`
      ),
      editionNumber: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}isEditionNumber`
      )
    } as Book;    
  }


  readRes2BookSection(readResource: ReadResource): BookSection {  
    return {
      ...this.readRes2Publication(readResource),
      publisherValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}bookSectionHasPublisherValue`
      ),
      book: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}bookSectionIsPartOf`
      ),
      pages: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}bookSectionIsInPages`
      ),
      volume: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}isInBookVolume`
      )
    } as BookSection;    
  }

  readRes2PublisherLight(readResource: ReadResource): PublisherLight {  
    return {
      ...this.readRes2Resource(readResource),
      name: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}publisherHasName`
      ),
      location: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}publisherHasLocation`
      )
    } as PublisherLight;    
  }



  readRes2PersonLight(readResource: ReadResource): PersonLight {  //this will populate PersonLight, following indications in the interface in person.mmodel.ts
    return {
      ...this.readRes2Resource(readResource),
      surname: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasFamilyName`
      ),
      name: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasGivenName`
      )
    } as PersonLight;    //this indicates the interface declared in person.model.ts
  }

  readRes2Person(readResource: ReadResource): Person {
    return {
      ...this.readRes2PersonLight(readResource),  // person includes PersonLight's attributes
      dateOfBirth: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasBirthDate`
      ),
      dateOfDeath: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasDeathDate`
      ),
      notice: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasNotice`
      ),
      DhsID: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasDhsID`
      ),
      Viaf: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}personHasAuthorityID`
      )
    } as Person;
  }



  readRes2AuthorLight(readResource: ReadResource): AuthorLight {  
    return {
      ...this.readRes2Resource(readResource),
      surname: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}authorHasFamilyName`
      ),
      name: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}authorHasGivenName`
      )
    } as AuthorLight;    
  }




  readRes2PlaceLight(readResource: ReadResource): PlaceLight {  
    return {
      ...this.readRes2Resource(readResource),
      name: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}placeHasName`
      )
    } as PlaceLight;    //this indicates the interface declared in place.model.ts
  }

  readRes2Place(readResource: ReadResource): Place {
    return {
      ...this.readRes2PlaceLight(readResource),  
      lat: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasLatitude`
        
      ),
      long: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasLongitude`
      ),
      notice: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}placeHasNotice`
      )
    } as Place;
  }

  readRes2TextLight(readResource: ReadResource): TextLight {
    return {
      ...this.readRes2Resource(readResource),
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}establishedTextHasTitle`
      ),
      editorialSet: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}establishedTextHasEditorialSet`
      )
    } as TextLight;
  }

  readRes2Text(readResource: ReadResource): Text {
    return {
      ...this.readRes2TextLight(readResource),
      establishedText: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasTextContent`
      ),
      baseWitMs: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasDirectSourceManuscriptValue`
      ),
      baseWitPub: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}hasDirectSourcePublicationValue`
      ) 
    } as Text;
  }


  readRes2Work(readResource: ReadResource): Work {  
    return {
      ...this.readRes2Resource(readResource),
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}workHasTitle`
      ),
      authorValue: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}workHasAuthorValue`
      ),
      date: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}workHasDate`
      ),
      notice: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}workHasNotice`
      )
    } as Work;    
  }


  readRes2EssayLight(readResource: ReadResource): EssayLight {  
    return {
      ...this.readRes2Resource(readResource),
      title: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}essayHasTitle`
      ),
      author: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}essayHasAuthor`
      )
    } as EssayLight;    
  }

  readRes2Essay(readResource: ReadResource): Essay {
    return {
      ...this.readRes2EssayLight(readResource),  
      textContent: this.getFirstValueAsStringOrNullOfProperty(
        readResource,
        `${this.getOntoPrefixPath()}essayHasTextContent`
      ),
      photos: this.getArrayOfValues(
        readResource,
        `${this.getOntoPrefixPath()}essayHasLinkToPhotoValue`
      ),
      scans: this.getArrayOfValues(
        readResource,
        `${this.getOntoPrefixPath()}essayHasLinkToScanValue`
      ),
      biblios: this.getArrayOfValues(
        readResource,
        `${this.getOntoPrefixPath()}essayHasBibliographyItemValue`
      )
    } as Essay;
  }



  getFirstValueAsStringOrNullOfProperty(
    readResource: ReadResource,
    property: string
  ) {
    const values: string[] = readResource
      ? readResource.getValuesAsStringArray(property)
      : null;
    return values && values.length >= 1 ? values[0] : null;
  }
  


  getArrayOfValues(
    readResource: ReadResource,
    property: string
  ) {
    return readResource.getValuesAsStringArray(property)
  }

}
