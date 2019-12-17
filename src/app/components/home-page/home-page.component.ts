import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'kd-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  prodMode = environment.production;
  knoraAppUrl = environment.knoraAppUrl;

  constructor() {}

  ngOnInit() {}
}
