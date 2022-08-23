import { Component, OnInit, ElementRef, DoCheck } from '@angular/core';
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
export class MsPageComponent implements OnInit, DoCheck {


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

  panelPoeticPubDisableState: boolean = false;
  panelDiaryPubDisableState: boolean = false;
  panelDiaryLevelDisableState: boolean = false;


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute ,// it gives me the current route (URL)
    private el: ElementRef
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



  ngDoCheck() {
    // MOVE INTO DIRECTIVES ? NO, because it is more complicated to act on the disable attribute of the panel, which is here
    this.disableExpansionPanelPoeticPubIfEmtpy(this.el);
    this.disableExpansionPanelDiaryPubIfEmtpy(this.el);
    this.disableExpansionPanelDiaryLevelIfEmtpy(this.el);
    this.greyCategoryIfEmpty(this.el);
    this.makeLiPartAppearIfNotEmpty(this.el);
  }



  

  // FRAGILE, maybe replace with contains
  makeLiPartAppearIfNotEmpty(el: ElementRef) {
    el.nativeElement.querySelectorAll('span[class="liPart"]').forEach((liPartElt: HTMLElement) => {  
      // if there are two UL and the second has children, that is if there are PubParts with children
      if (liPartElt.children.length > 2) {
        if (liPartElt.children[2].children[0].children.length > 0) {
          liPartElt.style.display = "block";
        }
      }
    });
  }


  greyCategoryIfEmpty(el:ElementRef) {
    el.nativeElement.querySelectorAll('div[class="mainCategory"]').forEach((mainCatEl: HTMLElement) => {
      var liDiaryPubLength = mainCatEl.getElementsByClassName("liDiaryLevel").length;
      if (liDiaryPubLength > 0) {
        mainCatEl.style.color = "black";        
      }
      else {
        mainCatEl.style.color = "#bfbfbf";  
      };
    });
  }


  // CAN BE PUT ALL TOGETHER IN ONE FUNCTION ADDING A CLASS INSTEAD OF AN ID ON THE PANELS ??

  disableExpansionPanelPoeticPubIfEmtpy(el: ElementRef) {
    // this shold be replaced with querySelector, because it is only one
    el.nativeElement.querySelectorAll('#panelPoeticPub').forEach((panPubElt: HTMLElement) => { 
      // check how many li exists
      var liPoeticPubLength = panPubElt.getElementsByClassName("liPoeticPub").length
      if (liPoeticPubLength > 0) {
        this.panelPoeticPubDisableState = false;        
      }
      else {
        this.panelPoeticPubDisableState = true;
        //this is important, otherwise it gets stucked in "true" when view is checked (tried with all hook methods)
      };
    }); 
  }


  disableExpansionPanelDiaryPubIfEmtpy(el: ElementRef) {
    // this shold be replaced with querySelector, because it is only one
    el.nativeElement.querySelectorAll('#panelDiaryPub').forEach((panPubElt: HTMLElement) => { 
      // check how many li exists
      var liDiaryPubLength = panPubElt.getElementsByClassName("liDiaryPub").length
      if (liDiaryPubLength > 0) {
        this.panelDiaryPubDisableState = false;        
      }
      else {
        this.panelDiaryPubDisableState = true;
        //this is important, otherwise it gets stucked in "true" when view is checked (tried with all hook methods)
      };
    }); 
  }

  disableExpansionPanelDiaryLevelIfEmtpy(el: ElementRef) {
    // this shold be replaced with querySelector, because it is only one
    el.nativeElement.querySelectorAll('#panelDiaryLevel').forEach((panPubElt: HTMLElement) => { 
      // check how many li exists
      var liDiaryLevelLength = panPubElt.getElementsByClassName("liDiaryLevel").length
      if (liDiaryLevelLength > 0) {
        this.panelDiaryLevelDisableState = false;        
      }
      else {
        this.panelDiaryLevelDisableState = true;
        //this is important, otherwise it gets stucked in "true" when view is checked (tried with all hook methods)
      };
    }); 
  }




}




     
