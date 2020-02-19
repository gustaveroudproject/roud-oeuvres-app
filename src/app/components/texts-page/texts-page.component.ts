import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Text} from '../../models/text.model';


@Component({
  selector: 'or-texts-page',
  templateUrl: './texts-page.component.html',
  styleUrls: ['./texts-page.component.scss']
})
export class TextsPageComponent implements OnInit {
  texts = [];
  selectedText: Text;
  index = 0;

  constructor(
    private dataService: DataService
  ) {}

  ngOnInit() {


    this.dataService.getTexts().subscribe(
      (texts: Text[]) => {
        this.texts.push(...texts);
        this.index = this.index + 1;
      },
      error => console.error(error)
    );

    
  }
  encodeURIComponent(iri: string) {
    return encodeURIComponent(iri);

  }
}
