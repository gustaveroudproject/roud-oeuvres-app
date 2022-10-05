import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MsPartLightWithStartingPageSeqnum } from 'src/app/models/manuscript.model';
import { Page } from '../../models/page.model';

@Component({
  selector: 'or-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.scss']
})
export class PageViewerComponent implements OnInit {
  @Input() pages: Page[];
  @Input() firstPageUrl: ReplaySubject<string>;
  @Input() msParts: MsPartLightWithStartingPageSeqnum[];
 
  selectedPageNum: number = 1; // default value, so it visualizes the first scan when arriving on the page
  imageUrl = new BehaviorSubject<SafeUrl>(null);


  constructor(
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.firstPageUrl.subscribe(
      url => this.imageUrl.next(this.sanitizer.bypassSecurityTrustUrl(url))
    );
  }

  selectOnChange(value) {
    let us = this;
    if (us.selectedPageNum != value) {
      us.selectedPageNum = value;
      us.imageUrl.next(us.sanitizer.bypassSecurityTrustUrl(us.pages[value].imageURL));
    }
  }

}
