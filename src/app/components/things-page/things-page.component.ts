import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Thing } from 'src/app/models/thing.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-things-page',
  templateUrl: './things-page.component.html',
  styleUrls: ['./things-page.component.scss']
})
export class ThingsPageComponent implements OnInit {
  things: Thing[];
  selectedThing: Thing;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dataService.getThings().subscribe(
      (things: Thing[]) => {
      this.things = things;
      },
      error => console.error(error)
    );

  }
}
