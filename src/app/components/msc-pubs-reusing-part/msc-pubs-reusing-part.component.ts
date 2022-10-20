import { Component, OnInit, Input } from '@angular/core';
import { concat } from 'rxjs';
import { take } from 'rxjs/operators';
import { PubPartLight, PublicationLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';



@Component({
  selector: 'or-msc-pubs-reusing-part',
  templateUrl: './msc-pubs-reusing-part.component.html',
  styleUrls: ['./msc-pubs-reusing-part.component.scss']
})
export class MscPubsReusingPartComponent implements OnInit {

  pubsReusingParts: (PublicationLight | PubPartLight)[];
  pubFromParts3: PublicationLight;


  @Input()
  msPartId: string;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.pubsReusingParts = [];

    //// get publications reusing this ms part
    this.dataService
      .getPublicationsReusingMsPart(this.msPartId)
      .subscribe((publicationsReusingParts: PublicationLight[]) => {
        this.pubsReusingParts.push(...publicationsReusingParts);
      });

    //// get publication parts reusing this ms part
    let pubPartsReusingParts: PubPartLight[] = [];
    this.dataService
      .getPublicationPartsReusingMsPart(this.msPartId)
      .subscribe(
        // next:
        (parts: PubPartLight[]) => {
          pubPartsReusingParts.push(...parts);
        },
        // error:
        e => console.log(e),
        // complete:
        () => {
          this.pubsReusingParts.push(...pubPartsReusingParts);
          //// get publications from publications' IRIs
          concat(
            ...(
              pubPartsReusingParts
                .map(part => part.isPartOfPubValue)
                .map(pubValue => this.dataService.getPubOfPubPart(pubValue))
            )
          )
          .pipe(take(1))
          .subscribe(
            (pub: PublicationLight) => { this.pubFromParts3 = pub; }
          )
        });
  }

}
