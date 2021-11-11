import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'or-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  //prodMode = environment.production;
  //knoraAppUrl = environment.knoraAppUrl;
  public isMenuCollapsed = true;
  constructor() { }

  ngOnInit() {
  
  }

}
