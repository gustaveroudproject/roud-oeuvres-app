import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Picture } from 'src/app/models/picture.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-essay-photo',
  templateUrl: './essay-photo.component.html',
  styleUrls: ['./essay-photo.component.scss']
})
export class EssayPhotoComponent implements OnInit {

  photo:Picture;
  @Input() essayPhotoId: string;

  constructor(private dataService: DataService, public sanitizer: DomSanitizer) { }

  ngOnInit() {

    this.dataService
      .getPicture(this.essayPhotoId)
      .subscribe(
        (photo: Picture) => {
          this.photo = photo;
    });
  }

}
