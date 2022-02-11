import { Component, OnInit, Input } from '@angular/core';
import { MsPartLight, MsLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'or-pubc-diary-reused-part',
  templateUrl: './pubc-diary-reused-part.component.html',
  styleUrls: ['./pubc-diary-reused-part.component.scss']
})
export class PubcDiaryReusedPartComponent implements OnInit {

  msPartsLight: MsPartLight[];
  mssReusedInParts: MsLight[];
  msPartsReusedInParts: MsPartLight[];
  msLight2: MsLight;

  reusedInParts: any[]; // array with MsLight and MsPartLight together


  @Input()
  pubPartId: string ;


  constructor(
    
    private dataService: DataService
    ) {}
  
    ngOnInit() {

      this.reusedInParts = [];

      //// get mss (journal notes) reused in pubPart IRI
      this.dataService
      .getMssReusedInPubParts(this.pubPartId)
      .subscribe((mssReusedInParts: MsLight[]) => {
          this.mssReusedInParts = mssReusedInParts;

          this.reusedInParts.push(...mssReusedInParts);

      });

      //// get ms parts (journal notes) reused in pubPart IRI
      this.dataService
      .getMsPartsReusedInPubParts(this.pubPartId)
      .subscribe((msPartsReusedInParts: MsPartLight[]) => {
          this.msPartsReusedInParts = msPartsReusedInParts;

          this.reusedInParts.push(...msPartsReusedInParts);  
      });

      
     

    }
    
  }
