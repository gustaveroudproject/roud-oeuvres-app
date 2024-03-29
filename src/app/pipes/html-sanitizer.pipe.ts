/* Used, for example, in person-view component */

/* To be used together with innerHTML */

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'htmlSanitizer'
})
export class HtmlSanitizerPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
