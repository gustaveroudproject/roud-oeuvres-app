import { Component, OnInit, Input } from '@angular/core';
import { Text } from 'src/app/models/text.model';


@Component({
  selector: 'or-text-view',
  templateUrl: './text-view.component.html',
  styleUrls: ['./text-view.component.scss']
})
export class TextViewComponent implements OnInit {
  @Input()
  text: Text;
  
  constructor() {}

  ngOnInit() {}

}