import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageResize'
})
export class ImageResizePipe implements PipeTransform {

  /**
   * transform url like : https://iiif.ls-prod-server.dasch.swiss/0112/G6TiAPry2hF-F4hPEgg14Nz.jpx/full/3409,4149/0/default.jpg
   * into :               https://iiif.ls-prod-server.dasch.swiss/0112/G6TiAPry2hF-F4hPEgg14Nz.jpx/full/,1000/0/default.jpg 
   * @param value 
   * @returns 
   */
  transform(imgIiifUrl: string): string {
    return imgIiifUrl.replace(/full\/[,0-9]+\/0\/default/, 'full/,1000/0/default');
  }

}
