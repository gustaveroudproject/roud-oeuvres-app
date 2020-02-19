import { Component, Input, OnInit } from '@angular/core';
import { ReadResource } from '@knora/api';
import { PersonLight } from 'src/app/models/person.model';

@Component({
  selector: 'or-persons-view',
  templateUrl: './persons-view.component.html',
  styleUrls: ['./persons-view.component.scss']
})
export class PersonsViewComponent implements OnInit {
  @Input()
  personLights: PersonLight[];

  constructor() {}

  ngOnInit() {}
}
