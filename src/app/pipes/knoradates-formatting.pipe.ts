import { Pipe, PipeTransform } from '@angular/core';
/*
 * Format Knora dates, which have GREGORIAN and CE
*/
@Pipe({name: 'knoradatesFormatting'})
export class knoradatesFormattingPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.slice(10,14): '?';
  }
}