import { Component, Input, OnInit } from '@angular/core';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-manuscriptpart',
  templateUrl: './manuscriptpart.component.html',
  styleUrls: ['./manuscriptpart.component.scss']
})
export class ManuscriptpartComponent implements OnInit {

  msPartLight: MsPartLight;
  msOfMsPart: MsLight;

  @Input() msPartIRI: string;
  @Input() msLightShelfmark: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService
      .getMsPartLight(this.msPartIRI)
      .subscribe(
        (msPartLight: MsPartLight) => {
          this.msPartLight = msPartLight;

          // asynchrone
          //// get mss from ms' IRIs
          this.dataService
          .getMsOfMsPart(msPartLight.isPartOfMsValue)
          .subscribe(
            (msOfMsPart: MsLight) => {
              this.msOfMsPart = msOfMsPart;
            }
          );
        },
        error => console.error(error)
      );
  }  
}
