import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from './services/data.service';


@Component({
  selector: 'or-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  constructor(translate: TranslateService, private dataService: DataService) {
    translate.setDefaultLang('fr');
  }

  ngOnInit() {
  }
}
