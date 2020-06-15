
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortByShelfmark' })
export class sortByShelfmarkPipe implements PipeTransform {


  // DOES NOT WORK
  

  transform(value: any[]) {
    if (!value) { console.log("NO!"); return value;  } // no aut
    if (value.length <= 1) { console.log("ONLY 1!"); console.log(value); return value; } // array with only one aut
    else {return value.sort((obj1, obj2) => {
      console.log("OK!");
      if (obj1.title > obj2.title) {
          return 1;
      }
      if (obj1.title < obj2.title) {
          return -1;
      }
    });
  }

    /*
    else {
      return value.sort((obj1, obj2) => {
        if (obj1.Shelfmark > obj2.Shelfmark) {
            return 1;
        }
        if (obj1.Shelfmark < obj2.Shelfmark) {
            return -1;
        }
      });
    }
  */
  }
  
}