import { Component, OnInit, Input, Output } from '@angular/core';
import { PubPartLight, PublicationLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'or-pubc-pubs-reusing-part',
  templateUrl: './pubc-pubs-reusing-part.component.html',
  styleUrls: ['./pubc-pubs-reusing-part.component.scss']
})
export class PubcPubsReusingPartComponent implements OnInit {

  pubPartsLight: PubPartLight[];
  publicationsReusingParts: PublicationLight[];
  pubPartsReusingParts: PubPartLight[];
  pubsReusingParts: any[]; // array with publicationsReusingParts and pubPartsReusingParts together
  pubOfParts4: PublicationLight;

  @Input()
  pubPartId: string ;




  constructor(
    
    private dataService: DataService
    ) {}
  
    ngOnInit() {
      
      this.pubsReusingParts = [];

      //// get publications reusing this publication part
      this.dataService
      .getPublicationsReusingPubPart(this.pubPartId)
      .subscribe((publicationsReusingParts: PublicationLight[]) => {
          this.publicationsReusingParts = publicationsReusingParts;

          this.pubsReusingParts.push(...publicationsReusingParts);
        });

      //// get publication parts reusing this publication part
      this.dataService
      .getPublicationPartsReusingPubPart(this.pubPartId)
      .subscribe((pubPartsReusingParts: PubPartLight[]) => {
          this.pubPartsReusingParts = pubPartsReusingParts;

          this.pubsReusingParts.push(...pubPartsReusingParts);

          // asynchrone
          //// get publications from publications' IRIs
          for (var pub in pubPartsReusingParts) {
            this.dataService
            .getPubOfPubPart(pubPartsReusingParts[pub].isPartOfPubValue)
            .subscribe(
              (pubOfParts4: PublicationLight) => {
                this.pubOfParts4 = pubOfParts4;
              });
            }
        });
        
    }
  }