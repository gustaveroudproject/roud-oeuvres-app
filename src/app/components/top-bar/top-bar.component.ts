import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'or-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  public isMenuCollapsed = true;
  
  constructor() { }

  ngOnInit() { }

}
