import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MsLight, MsPartLight, Manuscript } from 'src/app/models/manuscript.model';
import { Page } from 'src/app/models/page.model';
import { PublicationLight, Publication, PubPartLight, PubPart } from 'src/app/models/publication.model';



@Component({
  selector: 'or-ms-page',
  templateUrl: './ms-page.component.html',
  styleUrls: ['./ms-page.component.scss']
})
export class MsPageComponent implements OnInit {


  msLight: MsLight;
  msParts: MsPartLight[];
  pages: Page[];
  selectedPageNum: number = 1; // default value, so it visualizes the first scan when arriving on the page
  manuscript: Manuscript;
  manuscripts: Manuscript[];
  publicationsAvantTexte: PublicationLight[];
  pubPartsAvantTexte: PubPartLight[];
  pubFromParts: PublicationLight;
  pubsAvantTexte: any[]; // array with PublicationLight and PubPartLight together
  publicationsDiary: PublicationLight[];
  pubPartsDiary: PubPartLight[];
  pubFromParts2: PublicationLight;
  pubsDiary: any[]; // array with PublicationLight and PubPartLight together

  msReWritingMs: MsLight[];
  msPartsReWritingMs: MsPartLight[];
  rewritingMs: any[];
  msFromParts: MsLight;

  msRewrittenMs: MsLight[];
  msPartsReWrittenMs: MsPartLight[];
  rewrittenMs: any[];
  msFromParts3: MsLight;


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute // it gives me the current route (URL)
  ) {}

  ngOnInit() {

    this.route.paramMap.subscribe(
      params => {
        if (params.has('iri')) {
          //// get basic properties (msLight) of the manuscript
          this.dataService
            .getMsLight(decodeURIComponent(params.get('iri')))
            .subscribe(
              (msLight: MsLight) => {
                this.msLight = msLight;

                //// get facsimiles scans from publication IRI
                this.dataService
                .getPagesOfMs(msLight.id)
                .subscribe((pages: Page[]) => {
                  this.pages = pages;
                  //console.log(pages.length);
                  //console.log(this.selectedPageNum);
                });

                //// get complete manuscript
                this.dataService
                .getManuscript(msLight.id)
                .subscribe(
                  (manuscript: Manuscript) => {
                    this.manuscript = manuscript;
                });


                this.pubsAvantTexte = [];
                /// get publications with this ms as avant-texte
                this.dataService
                .getPublicationsWithThisAvantTexte(msLight.id)
                .subscribe((publicationsAvantTexte: PublicationLight[]) => {
                  this.publicationsAvantTexte = publicationsAvantTexte;

                  this.pubsAvantTexte.push(...publicationsAvantTexte);
                });

                /// get parts of publications with this ms as avant-texte
                this.dataService
                .getPublicationPartsWithThisAvantTexte(msLight.id)
                .subscribe((pubPartsAvantTexte: PubPartLight[]) => {
                  this.pubPartsAvantTexte = pubPartsAvantTexte;

                  this.pubsAvantTexte.push(...pubPartsAvantTexte);

                  for (var pubPart in pubPartsAvantTexte) {
                    this.dataService
                    .getPubOfPubPart(pubPartsAvantTexte[pubPart].isPartOfPubValue)
                    .subscribe(
                      (pubFromParts: PublicationLight) => {
                        this.pubFromParts = pubFromParts;
                      });
                    }
                });


                this.pubsDiary = [];
                /// get publications reusing diary
                this.dataService
                .getPubsReusingDiary(msLight.id)
                .subscribe((publicationsDiary: PublicationLight[]) => {
                  this.publicationsDiary = publicationsDiary;

                  this.pubsDiary.push(...publicationsDiary);
                });

                /// get pub parts reusing diary
                this.dataService
                .getPubPartsReusingDiary(msLight.id)
                .subscribe((pubPartsDiary: PubPartLight[]) => {
                  this.pubPartsDiary = pubPartsDiary;

                  this.pubsDiary.push(...pubPartsDiary);

                  for (var pubPart in pubPartsDiary) {
                    this.dataService
                    .getPubOfPubPart(pubPartsDiary[pubPart].isPartOfPubValue)
                    .subscribe(
                      (pubFromParts2: PublicationLight) => {
                        this.pubFromParts2 = pubFromParts2;
                      });
                    }
                });

                /// get ms parts (diary notes)
                this.dataService
                .getMsPartsFromMs(msLight.id)
                .subscribe((msParts: MsPartLight[]) => {
                  this.msParts = msParts;
                });


                this.rewritingMs = [];
                /// get ms rewriting ms
                this.dataService
                .getMssRewritingMs(msLight.id)
                .subscribe((msReWritingMs: MsLight[]) => {
                  this.msReWritingMs = msReWritingMs;

                  this.rewritingMs.push(...msReWritingMs);
                });

                /// get ms parts rewriting ms
                this.dataService
                .getMsPartsRewritingMs(msLight.id)
                .subscribe((msPartsReWritingMs: MsPartLight[]) => {
                  this.msPartsReWritingMs = msPartsReWritingMs;

                  this.rewritingMs.push(...msPartsReWritingMs);

                  for (var msPart in msPartsReWritingMs) {
                    this.dataService
                    .getMsOfMsPart(msPartsReWritingMs[msPart].isPartOfMsValue)
                    .subscribe(
                      (msFromParts: MsLight) => {
                        this.msFromParts = msFromParts;
                      });
                    }
                });


                this.rewrittenMs = [];
                /// get ms from which this ms is rewritten
                this.dataService
                .getMssRewrittenMs(msLight.id)
                .subscribe((msRewrittenMs: MsLight[]) => {
                  this.msRewrittenMs = msRewrittenMs;

                  this.rewrittenMs.push(...msRewrittenMs);
                });

                /// get ms parts from which this ms is rewritten
                this.dataService
                .getMsPartsRewrittenMs(msLight.id)
                .subscribe((msPartsReWrittenMs: MsPartLight[]) => {
                  this.msPartsReWrittenMs = msPartsReWrittenMs;

                  this.rewrittenMs.push(...msPartsReWrittenMs);

                  for (var msPart in msPartsReWrittenMs) {
                    this.dataService
                    .getMsOfMsPart(msPartsReWrittenMs[msPart].isPartOfMsValue)
                    .subscribe(
                      (msFromParts3: MsLight) => {
                        this.msFromParts3 = msFromParts3;
                      });
                    }
                });

          });

        }
      },
      error => console.error(error)
    );
  } 
}




     
