import { Component, OnInit, Input } from '@angular/core';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-msc-mss-rewritten-part',
  templateUrl: './msc-mss-rewritten-part.component.html',
  styleUrls: ['./msc-mss-rewritten-part.component.scss']
})
export class MscMssRewrittenPartComponent implements OnInit {

  mssRewrittenParts: any[];
  msFromParts4: MsLight;

  @Input()
  msPartId: string ;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    
    this.mssRewrittenParts = [];

    //// get manuscripts from which this ms part is rewritten
    this.dataService
    .getManuscriptsRewrittenMsPart(this.msPartId)
    .subscribe((manuscriptsRewrittenParts: MsLight[]) => {
        this.mssRewrittenParts.push(...manuscriptsRewrittenParts);
      });

    //// get manuscript parts from which this ms part is rewritten
    this.dataService
    .getMsPartsRewrittenMsPart(this.msPartId)
    .subscribe((msPartsRewrittenParts: MsPartLight[]) => {
      this.mssRewrittenParts.push(...msPartsRewrittenParts);

      // asynchrone
      //// get publications from publications' IRIs
      for (var msPart in msPartsRewrittenParts) {
        this.dataService
        .getMsOfMsPart(msPartsRewrittenParts[msPart].isPartOfMsValue)
        .subscribe(
          (msFromParts4: MsLight) => {
            this.msFromParts4 = msFromParts4;
          });
      }
    });
  }

}
