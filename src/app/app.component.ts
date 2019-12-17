import { Component, OnInit } from '@angular/core';
import { ReadResource } from '@knora/api';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { DataService } from './services/data.service';

@Component({
  selector: 'or-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  prodMode = environment.production;
  knoraAppUrl = environment.knoraAppUrl;
  things: ReadResource[];

  constructor(translate: TranslateService, private dataService: DataService) {
    translate.setDefaultLang('fr');
  }

  ngOnInit() {
    this.dataService.getThings().subscribe((resources: ReadResource[]) => {
      this.things = resources;
      console.log(resources);
    });
  }
}
