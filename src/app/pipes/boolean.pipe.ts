
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'boolean' })
export class booleanPipe implements PipeTransform {

  transform(value: boolean) {
    if (value == true) { return "oui"; } 
    else { return "no"; }

  }
  
}