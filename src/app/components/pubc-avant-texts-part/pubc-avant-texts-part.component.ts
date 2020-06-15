import { Component, OnInit, Input } from '@angular/core';
import { MsLight } from 'src/app/models/manuscript.model';
import { PubPartLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'or-pubc-avant-texts-part',
  templateUrl: './pubc-avant-texts-part.component.html',
  styleUrls: ['./pubc-avant-texts-part.component.scss']
})
export class PubcAvantTextsPartComponent implements OnInit {

  pubPartsLight: PubPartLight[];
  avantTextsParts: MsLight[];

  @Input()
  pubPartId: string ;



  constructor(
    
    private dataService: DataService
  ) {}

  ngOnInit() {

    //// get avant-textes from pubPart IRI
    this.dataService
    .getAvantTextsParts(this.pubPartId)
    .subscribe((avantTextsParts: MsLight[]) => {
        this.avantTextsParts = avantTextsParts;
        });
  }
}
