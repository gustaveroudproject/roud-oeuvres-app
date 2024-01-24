import { Component, OnInit } from '@angular/core';
import { Page } from 'src/app/models/page.model';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'or-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  // for viewer
  dataVizIri_PourUnMoissonneur: string = "http://rdfh.ch/0112/GhBbXbUvQWKfswctMiieGg";
  imagesDataVizForwarder = new ReplaySubject<Page[]>();

  constructor( ) { }

  ngOnInit() {
    let page: Page = { id: this.dataVizIri_PourUnMoissonneur } as Page;
    this.imagesDataVizForwarder.next([page]);
  }  
}
