import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PubPart } from 'src/app/models/publication.model';
import { Page } from 'src/app/models/page.model';

@Component({
  selector: 'or-pubc-part-selector',
  templateUrl: './pubc-part-selector.component.html',
  styleUrls: ['./pubc-part-selector.component.scss']
})
export class PubcPartSelectorComponent implements OnInit {
  
  pubParts: PubPart[];
  startingPage: Page;

  @Input()
  startingPageValue: string ;


  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
      
      this.dataService
        .getStartingPageOfPart(this.startingPageValue)
        .subscribe(
          (startingPage: Page) => {
            this.startingPage = startingPage;
          });
  }

}
