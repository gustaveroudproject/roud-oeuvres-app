import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PublicationLight, PubPartLight } from 'src/app/models/publication.model';


@Component({
  selector: 'or-pubc-pubs-reused-part',
  templateUrl: './pubc-pubs-reused-part.component.html',
  styleUrls: ['./pubc-pubs-reused-part.component.scss']
})
export class PubcPubsReusedPartComponent implements OnInit {

  pubsReusedInPart: PublicationLight[];
  pubPartsReusedInPart: PubPartLight[];
  pbReusedInPart: any[]; // array with pubsReusedInPart and pubPartsReusedInPart together
  pubOfParts2: PublicationLight;


  @Input()
  pubPartId: string ;
  
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.pbReusedInPart = [];

    //// get publications reused in pubPart IRI
    this.dataService
    .getPublicationsReusedInPubPart(this.pubPartId)
    .subscribe((pubsReusedInPart: PublicationLight[]) => {
        this.pubsReusedInPart = pubsReusedInPart;

        this.pbReusedInPart.push(...pubsReusedInPart);

    });

    //// get publication parts reused in pubPart IRI
    this.dataService
    .getPublicationPartsReusedInPubPart(this.pubPartId)
    .subscribe((pubPartsReusedInPart: PubPartLight[]) => {
        this.pubPartsReusedInPart = pubPartsReusedInPart;

        this.pbReusedInPart.push(...pubPartsReusedInPart);

        // asynchrone
        //// get publications from publications' IRIs
        for (var pubPart in pubPartsReusedInPart) {
          this.dataService
          .getPubOfPubPart(pubPartsReusedInPart[pubPart].isPartOfPubValue)
          .subscribe(
            (pubOfParts2: PublicationLight) => {
              this.pubOfParts2 = pubOfParts2;
            });
          }
    });

  }

}
