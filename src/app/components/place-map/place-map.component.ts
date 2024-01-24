import { Component, OnInit, Input } from '@angular/core';
import { Place } from 'src/app/models/place.model';
import * as L from 'leaflet';
import { Icon, icon } from 'leaflet';

@Component({
  selector: 'or-place-map',
  templateUrl: './place-map.component.html',
  styleUrls: ['./place-map.component.scss']
})
export class PlaceMapComponent implements OnInit {

  @Input() placeVar: Place;

  private defaultIcon: Icon = icon({
    iconUrl: 'assets/leaflet_img/leaf-red.png', // marker-icon.png
    shadowUrl: 'assets/leaflet_img/leaf-shadow.png',  //marker-shadow.png
    iconSize:     [38, 95], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  
  constructor() { }

  ngOnInit() {
    /*
    can use placeVar here only because in the parent component (place-page)
    there is the *ngIf that checks that the variable is already full
    */
   
    //console.log(this.placeVar.id);
    
    const map = L.map('map').setView([this.placeVar.lat, this.placeVar.long], 12);
                
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([this.placeVar.lat, this.placeVar.long], {icon: this.defaultIcon}).addTo(map);
  }

}
