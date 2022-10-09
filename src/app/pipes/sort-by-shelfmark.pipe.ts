
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortByShelfmark' })
export class sortByShelfmarkPipe implements PipeTransform {


transform(value: any[]) {
  if (!value) { return value; } // no aut
  if (value.length <= 1) { return value; } // array with only one aut
  else {
    return value.sort((obj1, obj2) => {

      // preprocess to remove xml declaration wrapping title
      var obj1title = obj1.shelfmark;
      var obj2title = obj2.shelfmark;
      
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