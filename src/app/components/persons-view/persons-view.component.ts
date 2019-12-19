import { Component, Input, OnInit } from '@angular/core';
import { ReadResource } from '@knora/api';

@Component({
  selector: 'or-persons-view',
  templateUrl: './persons-view.component.html',
  styleUrls: ['./persons-view.component.scss']
})
export class PersonsViewComponent implements OnInit {
  @Input()
  persons: ReadResource[];

  constructor() {}
  
  ngOnInit() {}
  
  encodeURIComponent(iri: string) {
      return encodeURIComponent(iri);
  
    }
}
