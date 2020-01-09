import { Component, OnInit } from '@angular/core';
import { ReadResource } from '@knora/api';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-things-page',
  templateUrl: './things-page.component.html',
  styleUrls: ['./things-page.component.scss']
})
export class ThingsPageComponent implements OnInit {
  things: ReadResource[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getThings().subscribe((resources: ReadResource[]) => {
      this.things = resources;
      console.log(resources);
    });
  }
}
