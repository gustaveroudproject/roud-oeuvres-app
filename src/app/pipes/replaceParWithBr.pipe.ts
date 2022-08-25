
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceParWithBr' })
export class replaceParWithBrPipe implements PipeTransform {

  transform(value: any) {
    return value = String(value)
    .replace(/<p>/g, "<br/>")
    .replace(/<\/p>/g, "");
  }
  
}