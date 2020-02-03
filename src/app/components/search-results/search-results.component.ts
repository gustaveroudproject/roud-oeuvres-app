import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'or-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  // copied from Knora-app

  searchQuery: string;
  searchMode: string;

  projectIri: string;

  constructor (private _route: ActivatedRoute,
      private _titleService: Title) {
      this._route.paramMap.subscribe((params: Params) => {
          // set the page title
          this._titleService.setTitle('Results found for "' + decodeURIComponent(params.get('q')) + '"');
      });
  }

  ngOnInit() {
  }
  
}