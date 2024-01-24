import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sortBySurname' })
export class sortBySurnamePipe implements PipeTransform {

  transform(value: any[]) {
    if (!value) { return value; } // no aut
    if (value.length <= 1) { return value; } // array with only one aut
    else {
      return value.sort((obj1, obj2) => {
        if (obj1.surname > obj2.surname) {
            return 1;
        }
        if (obj1.surname < obj2.surname) {
            return -1;
        }
      });
    }
  }
  
}
