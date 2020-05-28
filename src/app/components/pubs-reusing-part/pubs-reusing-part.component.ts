import { Component, OnInit, Input, Output } from '@angular/core';
import { PubPartLight, PublicationLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'or-pubs-reusing-part',
  templateUrl: './pubs-reusing-part.component.html',
  styleUrls: ['./pubs-reusing-part.component.scss']
})
export class PubsReusingPartComponent implements OnInit {

  pubPartsLight: PubPartLight[];
  publicationsReusingParts: PublicationLight[];

  @Input()
  pubPartId: string ;




  constructor(
    
    private dataService: DataService
    ) {}
  
    ngOnInit() {
  
      //// get avant-textes from pubPart IRI
      this.dataService
      .getPublicationsReusingPubParts(this.pubPartId)
      .subscribe((publicationsReusingParts: PublicationLight[]) => {
          this.publicationsReusingParts = publicationsReusingParts;
          });
    }
  }