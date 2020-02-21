import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  DoCheck,
  OnInit,
  Input,
  EventEmitter,
  Output
} from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[orPageLink]'
})
export class PageLinkDirective implements DoCheck {
  @Output()
  pageNumChange = new EventEmitter<string>();

  @Input()
  set pageNum(pageNum: string) {
    if (pageNum) {
      console.log('try to scroll to page ' + pageNum);
      this.el.nativeElement
        .querySelectorAll('a[class="pageLink"]')
        .forEach((aElt: HTMLElement) => {
          if (aElt.attributes['href'].value === pageNum) {
            console.log('Found page, scroll to ' + pageNum);
            aElt.scrollIntoView();
          }
        });
    }
  }

  constructor(private el: ElementRef) {}

  onClick(event) {
    const page = event.target.attributes['href'].value;
    console.log('open page ' + page);
    this.pageNumChange.next(page);
    event.preventDefault();
  }

  ngDoCheck(): void {
    this.el.nativeElement.querySelectorAll('a').forEach((aElt: HTMLElement) => {
      aElt.addEventListener('click', this.onClick.bind(this));
    });
  }
}
