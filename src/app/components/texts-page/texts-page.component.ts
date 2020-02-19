import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Text, TextLight } from '../../models/text.model';

@Component({
  selector: 'or-texts-page',
  templateUrl: './texts-page.component.html',
  styleUrls: ['./texts-page.component.scss']
})
export class TextsPageComponent implements OnInit {
  textLights: TextLight[] = [];
  selectedText: Text;
  index = 0;

  constructor(private dataService: DataService) {}

  onLoadNextPage() {
    this.dataService.getTextLights(this.index).subscribe(
      (texts: Text[]) => {
        this.textLights.push(...texts);
        this.index = this.index + 1;
      },
      error => console.error(error)
    );
  }

  ngOnInit() {
    this.onLoadNextPage();
  }
}
