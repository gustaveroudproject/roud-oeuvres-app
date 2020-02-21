import { Component, OnInit, Input } from '@angular/core';
import { Text } from 'src/app/models/text.model';
import { Page } from 'src/app/models/page.model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-text-page',
  templateUrl: './text-page.component.html',
  styleUrls: ['./text-page.component.scss']
})
export class TextPageComponent implements OnInit {
  text: Text;
  pages: Page[];
  selectedPageNum: null;  //give here a default value is not enough to visualize page, it doesn't take the page.imageURL

  constructor(
    private route: ActivatedRoute, // it gives me the current route (URL)
    private dataService: DataService
  ) {}

  ngOnInit() {
    //1. recuperer IRI du URL courent (ActivatedRoute)
    //2. recuperer la ressource de Knora
    //3. construire un objet de la classe text
    //4. l'affecter à cette variable

    this.route.paramMap.subscribe(
      params => {
        this.dataService
          .getText(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .subscribe(
            (text: Text) => {
              this.text = text; // step 4    I give to the attribute text the value of text

              // asynchrone, we need text to ask pages of text
              this.dataService
                .getPagesOfText(text.id)
                .subscribe((pages: Page[]) => {
                  this.pages = pages;
                });
            },
            error => console.error(error)
          );
      },
      error => console.error(error)
    );
  }
}
