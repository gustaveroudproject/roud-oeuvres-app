import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'; 
import { finalize } from 'rxjs/operators';
import { EssayLight, Essay } from 'src/app/models/essay.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-essays-page',
  templateUrl: './essays-page.component.html',
  styleUrls: ['./essays-page.component.scss']
})
export class EssaysPageComponent implements OnInit {

  essaysLight: EssayLight[] = [];
  index = 0;

  loadingResults = 0;
  
  constructor(config: NgbCarouselConfig, private dataService: DataService) {  
    config.interval = 6000;  
    config.wrap = true;  
    config.keyboard = true;  
    config.pauseOnHover = true;  
  }  

  finalizeWait() {
    this.loadingResults--;
    console.log("finalize: "+ this.loadingResults);
  }

  ngOnInit() {

    this.loadingResults++;
    this.dataService.getEssaysLight(this.index)
    .pipe(finalize(() => this.finalizeWait()))
    .subscribe(
      (essays: Essay[]) => {
        this.essaysLight.push(...essays);
        this.index = this.index + 1;
      },
      error => console.error(error)
    );
  }
  
}
