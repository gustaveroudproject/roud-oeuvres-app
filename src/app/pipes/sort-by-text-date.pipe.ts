import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortByTextDate' })
export class sortByTextDatePipe implements PipeTransform {

  transform(value: any[]) {
    if (!value) { return value; } // no aut
    if (value.length <= 1) { return value; } // array with only one aut
    else {
      return value.sort((obj1, obj2) => {

        // preprocess to remove xml declaration wrapping title
        var obj1title = obj1.date;
        var obj2title = obj2.date;
        
        // order them
        if (obj1title > obj2title) {
            return 1;
        }
        if (obj1title < obj2title) {
            return -1;
        }
      });
    }
  }
  
}
