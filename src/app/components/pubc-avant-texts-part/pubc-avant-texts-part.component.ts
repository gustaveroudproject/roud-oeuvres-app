import { Component, OnInit, Input } from '@angular/core';
import { MsLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-pubc-avant-texts-part',
  templateUrl: './pubc-avant-texts-part.component.html',
  styleUrls: ['./pubc-avant-texts-part.component.scss']
})
export class PubcAvantTextsPartComponent implements OnInit {

  avantTextsParts: MsLight[] = [];

  @Input() pubPartId: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    //// get avant-textes from pubPart IRI
    this.dataService
    .getAllAvantTextsParts(this.pubPartId)
    .subscribe((avantTextsParts: MsLight[]) => {
      this.avantTextsParts.push(...avantTextsParts);
    });
  }
}
