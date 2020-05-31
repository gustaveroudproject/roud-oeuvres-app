import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MsLight, MsPartLight, Manuscript } from 'src/app/models/manuscript.model';
import { Page } from 'src/app/models/page.model';
import { PublicationLight, Publication } from 'src/app/models/publication.model';



@Component({
  selector: 'or-ms-page',
  templateUrl: './ms-page.component.html',
  styleUrls: ['./ms-page.component.scss']
})
export class MsPageComponent implements OnInit {


  msLight: MsLight;
  pages: Page[];
  selectedPageNum: number = 1; // default value, so it visualizes the first scan when arriving on the page
  manuscript: Manuscript;
  manuscripts: Manuscript[];
  publicationsAvantTexte: PublicationLight[];


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

                /// get publications with this ms as avant-texte
                this.dataService
                .getPublicationsWithThisAvantTexte(msLight.id)
                .subscribe((publicationsAvantTexte: PublicationLight[]) => {
                  this.publicationsAvantTexte = publicationsAvantTexte;
                  console.log(publicationsAvantTexte);
                })
          });

        }
      },
      error => console.error(error)
    );
  } 
}




     
