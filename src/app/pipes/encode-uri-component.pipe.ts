/* Used everywhere */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'encodeURIComponent'
})
export class EncodeURIComponentPipe implements PipeTransform {
  constructor() {}

  transform(value: string) {
    return encodeURIComponent(value);   /* encodeURIComponent is a javascript function */
  }
}
