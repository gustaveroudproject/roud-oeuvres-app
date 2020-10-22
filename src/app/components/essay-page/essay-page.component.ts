import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Essay } from 'src/app/models/essay.model';
import { Page } from 'src/app/models/page.model';
import { Picture } from 'src/app/models/picture.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-essay-page',
  templateUrl: './essay-page.component.html',
  styleUrls: ['./essay-page.component.scss']
})
export class EssayPageComponent implements OnInit {

  essay: Essay;
  photo: Picture;
  photos: Picture[];
  page: Page;
  pages: Page[];

  constructor(
    private route: ActivatedRoute, // it gives me the current route (URL)
    private dataService: DataService
  ) {}

  ngOnInit() {
    //1. recuperer IRI du URL courent (ActivatedRoute)
    //2. recuperer la ressource de Knora
    //3. construire un objet de la classe essay
    //4. l'affecter à cette variable

    this.route.paramMap.subscribe(
      params => {
        this.dataService
          .getEssay(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .subscribe(
            (essay: Essay) => {
              this.essay = essay; // step 4    I give to the attribute essay the value of essay

              //// get photos from photos' IRIs
              this.photos = [];
              for (var photoVal in essay.photos) {
                this.dataService
                .getPicture(essay.photos[photoVal])
                .subscribe(
                  (photo: Picture) => {
                    this.photo = photo;
                    this.photos.push(photo);
                  });
                }

              //// get scans from scans' IRIs
              this.pages = [];
              for (var pageVal in essay.scans) {
                this.dataService
                .getPage(essay.scans[pageVal])
                .subscribe(
                  (page: Page) => {
                    this.page = page;
                    this.pages.push(page);
                  });
                }


            },
            error => console.error(error)
          );
      }
    );
  }

}
