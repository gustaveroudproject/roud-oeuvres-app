import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Text, TextLight } from '../../models/text.model';

@Component({
  selector: 'or-texts-page',
  templateUrl: './texts-page.component.html',
  styleUrls: ['./texts-page.component.scss']
})
export class TextsPageComponent implements OnInit {
  textsLight: TextLight[] = [];
  selectedText: Text;
  // index = 0;

  constructor(private dataService: DataService) {}

  //onLoadNextPage() {
    
  // }

  
  ngOnInit() {
    //this.onLoadNextPage();
    //this.dataService.getTextLights(this.index).subscribe(
    
    
    this.dataService.getTextLights()
    //.subscribe(
     // (texts: Text[]) => {
       // this.textLights.push(...texts);
        //this.index = this.index + 1;
        .subscribe((textsLight: TextLight[]) => {
          this.textsLight = textsLight;
          
          console.log(this.textsLight)

      },
      error => console.error(error)
    );

  }
}
