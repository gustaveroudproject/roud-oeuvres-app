
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeInternalPar' })
export class removeInternalParPipe implements PipeTransform {

  transform(value: any) {
    return value = String(value)
    .replace(/<p>/g, ". <span>")
    .replace(/<\/p>/g, "</span>");
  }
  
}