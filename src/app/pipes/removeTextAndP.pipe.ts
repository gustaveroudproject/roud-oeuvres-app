import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'removeTextAndPar' })
export class removeTextAndParPipe implements PipeTransform {

  transform(value: any) {
    return value = String(value)
    .replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<text><p>", "<span>")
    .replace("</p></text>", "</span>");
  }
  
}
