import { Component, OnInit, Input, Output } from '@angular/core';
import { concat } from 'rxjs';
import { take } from 'rxjs/operators';
import { PubPartLight, PublicationLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'or-pubc-pubs-reusing-part',
  templateUrl: './pubc-pubs-reusing-part.component.html',
  styleUrls: ['./pubc-pubs-reusing-part.component.scss']
})
export class PubcPubsReusingPartComponent implements OnInit {

  pubPartsLight: PubPartLight[];
  pubPartsReusingParts: PubPartLight[] = [];
  pubsReusingParts: (PublicationLight|PubPartLight)[] = []; // array with publicationsReusingParts and pubPartsReusingParts together
  pubOfParts4: PublicationLight;

  @Input()
  pubPartId: string ;




  constructor(
    
    private dataService: DataService
    ) {}
  
    ngOnInit() {
      
      //// get publications reusing this publication part
      this.dataService
      .getPublicationsReusingPubPart(this.pubPartId)
      .subscribe((publicationsReusingParts: PublicationLight[]) => {
          this.pubsReusingParts.push(...publicationsReusingParts);
      });

      //// get publication parts reusing this publication part
      this.dataService
      .getPublicationPartsReusingPubPart(this.pubPartId)
      .subscribe(
        // next:
        (pubPartsReusingParts: PubPartLight[]) => {
          this.pubPartsReusingParts.push(...pubPartsReusingParts);
        },
        // error:
        e => console.log(e),
        // complete:
        () => {
          this.pubsReusingParts.push(...this.pubPartsReusingParts);
          concat(
            ...(
              this.pubPartsReusingParts
              .map(part => part.isPartOfPubValue)
              .map(pubValue => this.dataService.getPubOfPubPart(pubValue))
            )
          )
          .pipe(take(1))
          .subscribe((part: PublicationLight) => { this.pubOfParts4 = part; });
        }
      );
    }
  }