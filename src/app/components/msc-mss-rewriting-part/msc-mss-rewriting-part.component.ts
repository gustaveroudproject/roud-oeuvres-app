import { Component, OnInit, Input } from '@angular/core';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-msc-mss-rewriting-part',
  templateUrl: './msc-mss-rewriting-part.component.html',
  styleUrls: ['./msc-mss-rewriting-part.component.scss']
})
export class MscMssRewritingPartComponent implements OnInit {

  mssRewritingParts: any[];
  manuscriptsRewritingParts: MsLight[];
  msPartsRewritingParts: MsPartLight[];
  msFromParts2: MsLight;

  @Input()
  msPartId: string ;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    
    this.mssRewritingParts = [];

      //// get manuscripts rewriting this ms part
      this.dataService
      .getManuscriptsRewritingMsPart(this.msPartId)
      .subscribe((manuscriptsRewritingParts: MsLight[]) => {
          this.manuscriptsRewritingParts = manuscriptsRewritingParts;

          this.mssRewritingParts.push(...manuscriptsRewritingParts);
        });

      //// get manuscript parts rewriting this ms part
      this.dataService
    .getMsPartsRewritingMsPart(this.msPartId)
    .subscribe((msPartsRewritingParts: MsPartLight[]) => {
        this.msPartsRewritingParts = msPartsRewritingParts;

        this.mssRewritingParts.push(...msPartsRewritingParts);

        // asynchrone
          //// get publications from publications' IRIs
          for (var msPart in msPartsRewritingParts) {
            this.dataService
            .getMsOfMsPart(msPartsRewritingParts[msPart].isPartOfMsValue)
            .subscribe(
              (msFromParts2: MsLight) => {
                this.msFromParts2 = msFromParts2;
              });
            }
        });
  }

}
