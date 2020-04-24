import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'; 


@Component({
  selector: 'or-essays-page',
  templateUrl: './essays-page.component.html',
  styleUrls: ['./essays-page.component.scss']
})
export class EssaysPageComponent implements OnInit {

  constructor(config: NgbCarouselConfig) {  
    config.interval = 6000;  
    config.wrap = true;  
    config.keyboard = true;  
    config.pauseOnHover = true;  
  }  
  ngOnInit() {  
  }  

}
