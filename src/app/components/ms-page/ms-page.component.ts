import { Component, OnInit, ElementRef, DoCheck } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MsLight, MsPartLight, Manuscript, MsPartLightWithStartingPageSeqnum } from 'src/app/models/manuscript.model';
import { Page, PageLight } from 'src/app/models/page.model';
import { PublicationLight, PubPartLight } from 'src/app/models/publication.model';
import { finalize, take } from 'rxjs/operators';
import { ReadResourceSequence } from '@dasch-swiss/dsp-js';
import { concat, ReplaySubject } from 'rxjs';




@Component({
  selector: 'or-ms-page',
  templateUrl: './ms-page.component.html',
  styleUrls: ['./ms-page.component.scss']
})
export class MsPageComponent implements OnInit, DoCheck {


  msLight: MsLight;
  msParts: MsPartLightWithStartingPageSeqnum[] = [];
  pages: Page[] = [];
  firstPageSwitch = true;
  firstPageUrl = new ReplaySubject<string>();
  msPartStartingPage: PageLight;
  manuscript: Manuscript;
  manuscripts: Manuscript[];
  pubFromParts: PublicationLight;
  pubsAvantTexte: any[] = []; // array with PublicationLight and PubPartLight together
  pubsDiary: any[]; // array with PublicationLight and PubPartLight together

  rewritingMs: any[] = [];
  msFromParts: MsLight;

  rewrittenMs: (MsLight|bufferMsPartsReWrittenMs)[] = [];
  msFromParts3: MsLight;

  panelPoeticPubDisableState: boolean = false;
  panelDiaryPubDisableState: boolean = false;
  panelDiaryLevelDisableState: boolean = false;

  loadingResults = 0;

  imagesPubForwarder = new ReplaySubject<Page[]>();


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute ,// it gives me the current route (URL)
    private el: ElementRef,
  ) {}

  finalizeWait() {
    this.loadingResults--;
    console.log("finalize: "+ this.loadingResults);
  }

  ngOnInit() {

    // this.loadingResults++;

    this.route.paramMap
    .pipe(finalize(() => this.finalizeWait()))
    .subscribe(
      params => {
        if (params.has('iri')) {
          this.loadingResults++;
          //console.log(this.loadingResults)
                  
          //// get basic properties (msLight) of the manuscript
          this.dataService
            .getMsLight(decodeURIComponent(params.get('iri')))
            .pipe(finalize(() => this.finalizeWait()))
            .subscribe(
              (msLight: MsLight) => {        
                this.msLight = msLight;
                //console.log(this.msLight)

                //// get facsimiles scans from publication IRI
                this.loadingResults++;
                this.dataService
                .getAllPagesOfMs(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe((pages: Page[]) => {
                  this.imagesPubForwarder.next(pages);
                  this.pages.push(...pages);
                  //console.log(pages.length);
                  //console.log(this.selectedPageNum);
                },
                error => console.log(error)
                );

                //// get complete manuscript
                this.loadingResults++;
                this.dataService
                .getManuscript(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe(
                  (manuscript: Manuscript) => {
                    this.manuscript = manuscript;
                    //console.log(this.manuscript)
                  },
                  error => console.log(error)
                );


                /// get publications with this ms as avant-texte
                this.loadingResults++;
                this.dataService
                .getAllPublicationsWithThisAvantTexte(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe(
                  (publicationsAvantTexte: PublicationLight[]) => {
                    this.pubsAvantTexte.push(...publicationsAvantTexte);
                  },
                  error => console.log(error)
                );

                /// get parts of publications with this ms as avant-texte
                this.loadingResults++;
                let bufferPubPartsAvantTexte: PubPartLight[] = [];
                this.dataService
                .getAllPublicationPartsWithThisAvantTexte(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe(
                  // next:
                  (pubPartsAvantTexte: PubPartLight[]) => {
                    bufferPubPartsAvantTexte.push(...pubPartsAvantTexte);
                    //console.log(this.pubsAvantTexte)
                  },
                  // error:
                  error => console.log(error),
                  // complete:
                  () => {
                    this.pubsAvantTexte.push(...bufferPubPartsAvantTexte);
                    this.loadingResults++;
                    concat(...bufferPubPartsAvantTexte.map(part => this.dataService.getPubOfPubPart(part.isPartOfPubValue)))
                    .pipe(
                      take(1),
                      finalize(() => this.finalizeWait())
                    )
                    .subscribe((pubFromParts) => {
                      // if we have a candidate, we keep it
                      this.pubFromParts = pubFromParts;
                    })
                  }
                );

                this.pubsDiary = [];
                /// get publications reusing diary
                this.loadingResults++;
                this.dataService
                .getAllPubsReusingDiary(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe(
                  (publicationsDiary: PublicationLight[]) => {
                    this.pubsDiary.push(...publicationsDiary);
                  },
                  error => console.log(error));

                /// get pub parts reusing diary
                this.loadingResults++;
                this.dataService
                .getAllPubPartsReusingDiary(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe(
                  (pubPartsDiary: PubPartLight[]) => {
                    this.pubsDiary.push(...pubPartsDiary);
                    //console.log(this.pubsDiary)

                    for (var pubPart in pubPartsDiary) {
                      this.loadingResults++;
                      this.dataService
                      .getPubOfPubPart(pubPartsDiary[pubPart].isPartOfPubValue)
                      .pipe(finalize(() => this.finalizeWait()))
                      .subscribe(
                        (pubFromPart: PublicationLight) => {
                          pubPartsDiary[pubPart].pubFromPart = pubFromPart;
                          // this.pubFromParts2 = pubFromParts2;
                        },
                        error => console.log(error)
                      );
                    }
                  },
                  error => console.log(error)
                );

                /// get ms parts (diary notes)
                this.loadingResults++;
                this.dataService
                .getAllMsPartsFromMs(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe((msParts: MsPartLightWithStartingPageSeqnum[]) => {
                  this.msParts.push(...msParts);
                },
                error => console.log(error)
                );


                /// get ms rewriting ms
                this.loadingResults++;
                this.dataService
                .getAllMssRewritingMs(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe((msReWritingMs: MsLight[]) => {
                  this.rewritingMs.push(...msReWritingMs);
                },
                error => console.log(error));

                /// get ms parts rewriting ms
                this.loadingResults++;
                this.dataService
                .getAllMsPartsRewritingMs(msLight.id)
                .pipe(finalize(() => {
                  this.finalizeWait();

                  // once we collected all of the rewritingMs
                  this.loadingResults++;
                  concat(...this.rewritingMs.map(part => this.dataService.getMsOfMsPart(part.isPartOfMsValue)))
                  .pipe(
                    take(1),
                    finalize(() => this.finalizeWait())
                  )
                  .subscribe((msFromParts) => {
                    // if we have a candidate, we keep it
                    this.msFromParts = msFromParts;
                  },
                  error => console.log(error));

                }))
                .subscribe((msPartsReWritingMs: MsPartLight[]) => {
                  this.rewritingMs.push(...msPartsReWritingMs);  
                },
                error => console.log(error));

                /// get ms from which this ms is rewritten
                this.loadingResults++;
                this.dataService
                .getAllMssRewrittenMs(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe((msRewrittenMs: MsLight[]) => {
                  this.rewrittenMs.push(...msRewrittenMs);
                },
                error => console.log(error));

                /// get ms parts from which this ms is rewritten
                this.loadingResults++;
                let bufferMsPartsReWrittenMs: MsPartLight[] = [];
                this.dataService
                .getAllMsPartsRewrittenMs(msLight.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe(
                  //next:
                  (msPartsReWrittenMs: MsPartLight[]) => {
                    bufferMsPartsReWrittenMs.push(...msPartsReWrittenMs);
                    //console.log(this.rewrittenMs)
                  },
                  // error:
                  error => console.log(error),
                  // complete:
                  () => {
                    this.rewrittenMs.push(...bufferMsPartsReWrittenMs);                    

                    // once we collected all of the rewrittenMs
                    this.loadingResults++;
                    concat(...bufferMsPartsReWrittenMs.map(part => this.dataService.getMsOfMsPart(part.isPartOfMsValue)))
                    .pipe(
                      take(1),
                      finalize(() => this.finalizeWait())
                    )
                    .subscribe((msFromParts) => {
                      this.msFromParts3 = msFromParts;
                    },
                    error => console.log(error));
                  }
                );
              },
              error => console.log(error)
            );
        }
      },
      error => console.log(error)
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
