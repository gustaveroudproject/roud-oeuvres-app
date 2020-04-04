/*

* Used, for example, in person-view component

* It formats Knora dates, by removing info on the calendar (GREGORIAN) and era (CE)

* If no date is found, returns "?"

*/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'knoradatesFormatting'})
export class knoradatesFormattingPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.slice(10,14): '?';
  }
}