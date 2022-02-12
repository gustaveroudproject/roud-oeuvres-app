import { Component, Input, OnInit } from '@angular/core';
import { MsLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'or-manuscript',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss']
})
export class ManuscriptComponent implements OnInit {

  msLight: MsLight;

  @Input()
  msIRI: string ;

  
  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    
    this.dataService
      .getMsLight(this.msIRI)
      .subscribe(
        (msLight: MsLight) => {
          this.msLight = msLight;

        },
        error => console.error(error)
      );
  }  
}


