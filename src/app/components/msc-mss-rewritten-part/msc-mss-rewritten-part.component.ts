import { Component, OnInit, Input } from '@angular/core';
import { concat } from 'rxjs';
import { take } from 'rxjs/operators';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-msc-mss-rewritten-part',
  templateUrl: './msc-mss-rewritten-part.component.html',
  styleUrls: ['./msc-mss-rewritten-part.component.scss']
})
export class MscMssRewrittenPartComponent implements OnInit {

  mssRewrittenParts: (MsLight|MsPartLight)[];
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
    let msPartsRewrittenParts: MsPartLight[] = [];
    this.dataService
    .getMsPartsRewrittenMsPart(this.msPartId)
    .subscribe(
      // next: 
      (parts: MsPartLight[]) => msPartsRewrittenParts.push(...parts),
      // error:
      e => console.log(e),      
      // complete:
      () => {
        // push msPartsRewrittenParts into mssRewrittenParts
        this.mssRewrittenParts.push(...msPartsRewrittenParts);
        // get the `isPartOfMsValue` of the first part having a `isPartOfMsValue`
        concat(
          ...(
            msPartsRewrittenParts
            .map(part => part.isPartOfMsValue)
            .map(msValue => this.dataService.getMsOfMsPart(msValue))
          )
        )
        .pipe(take(1))
        .subscribe((msFromParts4: MsLight) => { this.msFromParts4 = msFromParts4; })
      }
    );
  }    
}
