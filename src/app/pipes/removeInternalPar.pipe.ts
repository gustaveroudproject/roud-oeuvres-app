
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeInternalPar' })
export class removeInternalParPipe implements PipeTransform {

  transform(value: any) {
    return value = String(value)
    .replaceAll("<p>", ". <span>")
    .replaceAll("</p>", "</span>");
  }
  
}