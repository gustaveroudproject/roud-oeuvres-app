import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortByMsTitle' })
export class sortByMsTitlePipe implements PipeTransform {

  transform(value: any[]) {
    if (!value) { return value; } // no aut
    if (value.length <= 1) { return value; } // array with only one aut
    else {
      return value.sort((obj1, obj2) => {

        // preprocess to remove xml declaration wrapping title
        var obj1title = obj1.title;
        var obj2title = obj2.title;
        if (obj1title.indexOf('<') != -1) { // if title contains '<'
          obj1title = obj1title.slice(45);  // remove first 45 characters
        }
        if (obj2title.indexOf('<') != -1) {
          obj2title = obj2title.slice(45);
        }
        
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
