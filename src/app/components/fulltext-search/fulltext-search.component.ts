import { Component, OnInit } from '@angular/core';
import { Resource } from 'src/app/models/resource.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-fulltext-search',
  templateUrl: './fulltext-search.component.html',
  styleUrls: ['./fulltext-search.component.scss']
})
export class FulltextSearchComponent implements OnInit {
  resources: Resource[];
  constructor(private dataService: DataService) {}

  ngOnInit() {}

  onSearch(searchText: string) {
    if (searchText && searchText.length > 0) {  // check is not empty
      this.dataService.fullTextSearch(searchText).subscribe(
        (resources: Resource[]) => {
          this.resources = resources;
        },
        error => console.error(error)
      );
    }
  }
}
