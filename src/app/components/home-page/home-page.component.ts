import { Component, OnInit } from '@angular/core';
import { Constants, KnoraApiConnection, ReadResource, ReadStillImageFileValue } from '@dasch-swiss/dsp-js';
import { DataService } from 'src/app/services/data.service';
import { DspResource } from '../dsp-resource';
import { FileRepresentation } from '../file-representation';
import { Page } from 'src/app/models/page.model';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'or-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  // for viewer
  dataVizIri_PourUnMoissonneur: string = "http://rdfh.ch/0112/GhBbXbUvQWKfswctMiieGg"
  imagesDataVizForwarder = new ReplaySubject<Page[]>();


  constructor(

    private dataService: DataService,
    private knoraApiConnection: KnoraApiConnection,
  ) {}

  ngOnInit() {
    let page: Page = { id: this.dataVizIri_PourUnMoissonneur } as Page;
    this.imagesDataVizForwarder.next([page])
  }  
}



