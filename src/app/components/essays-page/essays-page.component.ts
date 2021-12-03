import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap'; 
import { EssayLight, Essay } from 'src/app/models/essay.model';
import { DataService } from 'src/app/services/data.service';
import { Picture } from 'src/app/models/picture.model';


@Component({
  selector: 'or-essays-page',
  templateUrl: './essays-page.component.html',
  styleUrls: ['./essays-page.component.scss']
})
export class EssaysPageComponent implements OnInit {

  constructor(config: NgbCarouselConfig, private dataService: DataService) {  
    config.interval = 6000;  
    config.wrap = true;  
    config.keyboard = true;  
    config.pauseOnHover = true;  
  }  


  essaysLight: EssayLight[] = [];
  essay: EssayLight;
  selectedEssay: Essay;
  index = 0;
  photo: Picture;
  photos: Picture[];
  

  ngOnInit() {

    this.dataService.getEssaysLight(this.index).subscribe(
      (essays: Essay[]) => {
        this.essaysLight.push(...essays);
        this.index = this.index + 1;

        for (var essay in essays) {
        //// get photos from photos' IRIs
        this.photos = [];
        for (var photoVal in essays[essay].photos) {
          this.dataService
          .getPicture(essays[essay].photos[photoVal])
          .subscribe(
            (photo: Picture) => {
              this.photo = photo;
              this.photos.push(photo);
            });
          }
        }

      },
      error => console.error(error)
    );
    
  }
  

}
