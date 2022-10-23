import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PublicationLight, PubPartLight } from 'src/app/models/publication.model';
import { concat } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
  selector: 'or-pubc-pubs-reused-part',
  templateUrl: './pubc-pubs-reused-part.component.html',
  styleUrls: ['./pubc-pubs-reused-part.component.scss']
})
export class PubcPubsReusedPartComponent implements OnInit {

  pubPartsReusedInPart: PubPartLight[] = [];
  pbReusedInPart: (PublicationLight|PubPartLight)[] = []; // array with pubsReusedInPart and pubPartsReusedInPart together
  pubOfParts2: PublicationLight;


  @Input()
  pubPartId: string ;
  
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {

    //// get publications reused in pubPart IRI
    this.dataService
    .getPublicationsReusedInPubPart(this.pubPartId)
    .subscribe((pubsReusedInPart: PublicationLight[]) => {
        this.pbReusedInPart.push(...pubsReusedInPart);
    });

    //// get publication parts reused in pubPart IRI
    this.dataService
    .getPublicationPartsReusedInPubPart(this.pubPartId)
    .subscribe(
      // next:
      (pubPartsReusedInPart: PubPartLight[]) => {
        this.pubPartsReusedInPart.push(...pubPartsReusedInPart);
      },
      // error:
      e => console.log(e),
      // complete:
      () => {
        this.pbReusedInPart.push(...this.pubPartsReusedInPart);
        concat(
          ...(
            this.pubPartsReusedInPart
            .map(part => part.isPartOfPubValue)
            .map(pubValue => this.dataService.getPubOfPubPart(pubValue))
          )
        )
        .pipe(take(1))
        .subscribe((part: PublicationLight) => { this.pubOfParts2 = part; });
      }
    );

  }

}
