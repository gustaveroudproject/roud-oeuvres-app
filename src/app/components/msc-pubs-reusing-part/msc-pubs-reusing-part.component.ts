import { Component, OnInit, Input } from '@angular/core';
import { PubPartLight, PublicationLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';



@Component({
  selector: 'or-msc-pubs-reusing-part',
  templateUrl: './msc-pubs-reusing-part.component.html',
  styleUrls: ['./msc-pubs-reusing-part.component.scss']
})
export class MscPubsReusingPartComponent implements OnInit {
  
  pubsReusingParts: any[];
  publicationsReusingParts: PublicationLight[];
  pubPartsReusingParts: PubPartLight[];
  pubFromParts3: PublicationLight;



  @Input()
  msPartId: string ;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.pubsReusingParts = [];

      //// get publications reusing this ms part
      this.dataService
      .getPublicationsReusingMsPart(this.msPartId)
      .subscribe((publicationsReusingParts: PublicationLight[]) => {
          this.publicationsReusingParts = publicationsReusingParts;

          this.pubsReusingParts.push(...publicationsReusingParts);
        });

      //// get publication parts reusing this ms part
      this.dataService
    .getPublicationPartsReusingMsPart(this.msPartId)
    .subscribe((pubPartsReusingParts: PubPartLight[]) => {
        this.pubPartsReusingParts = pubPartsReusingParts;

        this.pubsReusingParts.push(...pubPartsReusingParts);

        // asynchrone
          //// get publications from publications' IRIs
          for (var pub in pubPartsReusingParts) {
            this.dataService
            .getPubOfPubPart(pubPartsReusingParts[pub].isPartOfPubValue)
            .subscribe(
              (pubFromParts3: PublicationLight) => {
                this.pubFromParts3 = pubFromParts3;
              });
            }
        });
  }

}
