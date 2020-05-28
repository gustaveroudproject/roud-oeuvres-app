import { Component, OnInit, Input } from '@angular/core';
import { MsLight } from 'src/app/models/manuscript.model';
import { PubPartLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'or-avant-texts-part',
  templateUrl: './avant-texts-part.component.html',
  styleUrls: ['./avant-texts-part.component.scss']
})
export class AvantTextsPartComponent implements OnInit {

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
