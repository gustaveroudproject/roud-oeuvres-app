/*

* It formats Knora dates, by removing info on the calendar (GREGORIAN) and era (CE)

* If no date is found, returns "?"

* To be used when we want year and month, or year, month and day, depending on what is in data.
The other (knoradatesFormatting) is when we only want year.

*/

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'knoradatesYmdFormatting'})
export class knoradatesYmdFormattingPipe implements PipeTransform {

    


  transform(value: string): string {

      const monthsMap = new Map()
      monthsMap.set( "01", "janvier")
      monthsMap.set( "02", "février")
      monthsMap.set( "03", "mars")
      monthsMap.set( "04", "avril")
      monthsMap.set( "05", "mai")
      monthsMap.set( "06", "juin")
      monthsMap.set( "07", "juillet")
      monthsMap.set( "08", "août")
      monthsMap.set( "09", "septembre09")
      monthsMap.set( "10", "octobre")
      monthsMap.set( "11", "novembre")
      monthsMap.set( "12", "décembre")

    const date: string = value.substring(10,value.indexOf(' ')); // string GREGORIAN and CE from knora-date
    
    const year:string = date.substring(0,4);

    if (date.length > 4 && date.length <= 7) {
      const monthN:string = date.slice(5);  // extract number of month
      const month:string = monthsMap.get(monthN);  // find corresponding name of month in map above
      return month + ' ' + year;
    }
    if (date.length > 7) {
      const monthN:string = date.substring(5,7);
      const month:string = monthsMap.get(monthN);

      var day:string = date.slice(8);
      if (day.indexOf('0') == 0) {    // if day contains '0', remove it
        var day = day.slice(1);
      }
      return day + ' ' + month + ' ' + year;
    }
    else {
      return year;
    }
  }
}