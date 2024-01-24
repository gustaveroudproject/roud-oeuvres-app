import { Component, OnInit, Input } from '@angular/core';
import { concat } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MsLight, MsPartLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-msc-mss-rewriting-part',
  templateUrl: './msc-mss-rewriting-part.component.html',
  styleUrls: ['./msc-mss-rewriting-part.component.scss']
})
export class MscMssRewritingPartComponent implements OnInit {

  mssRewritingParts: (MsLight|MsPartLight)[];
  msFromParts2: MsLight;

  @Input() msPartId: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.mssRewritingParts = [];

    //// get manuscripts rewriting this ms part
    this.dataService
    .getAllManuscriptsRewritingMsPart(this.msPartId)
    .subscribe(
      (manuscriptsRewritingParts: MsLight[]) => {
        this.mssRewritingParts.push(...manuscriptsRewritingParts);
    });

    //// get manuscript parts rewriting this ms part
    let parts: MsPartLight[] = [];
    this.dataService
    .getAllMsPartsRewritingMsPart(this.msPartId)
    .subscribe(
      /*next:*/
      (msPartsRewritingParts: MsPartLight[]) => {
        parts.push(...msPartsRewritingParts);
      },
      /* error: */
      e => console.log(e),
      /* complete: */
      () => {
        // once we have the whole MsPartLight values
        // merge them with the MsLight
        this.mssRewritingParts.push(...parts);
        // get the first one having a MsLight from MsPartLight.getMsOfMsPart()
        concat(
          ...(
            parts
            .map(part => part.isPartOfMsValue)
            .map(msValue => this.dataService.getMsOfMsPart(msValue))
          )
        )
        .pipe(take(1))
        .subscribe((part: MsLight) => { this.msFromParts2 = part; });
      }
    );
  }

}
