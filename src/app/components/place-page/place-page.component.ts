import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/models/place.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { TextLight } from 'src/app/models/text.model';
import { Picture } from 'src/app/models/picture.model';
import { EssayPhotoComponent } from '../essay-photo/essay-photo.component';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'or-place-page',
  templateUrl: './place-page.component.html',
  styleUrls: ['./place-page.component.scss']
})
export class PlacePageComponent implements OnInit {
  place: Place;
  textsLight : TextLight[];
  photo: Picture;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute, // it gives me the current route (URL)
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {

    //1. recuperer IRI du URL courent (ActivatedRoute)
    //2. recuperer la ressource de Knora
    //3. construire un objet de la classe place
    //4. l'affecter à cette variable

    this.route.paramMap.subscribe(
      params => {
        this.dataService
          .getPlace(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .subscribe(
            (place: Place) => {
              this.place = place; // step 4    I give to the attribute place the value of place

              if (this.place.photo != null) {
              this.dataService
              .getPicture(place.photo)
              .subscribe(
                (photo: Picture) => {
                  this.photo = photo;
                });
              };

              // asynchrone, we need text to ask texts mentioning places
              this.dataService
              .getTextsMentioningPlaces(place.id)
              .subscribe((textsLight: TextLight[]) => {
                this.textsLight = textsLight;
                // console.log(textsLight);
                });
                    
                    
              },
              
              error => console.error(error)
            );
      },
      error => console.error(error)
    );


    
  }

}
