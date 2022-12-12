import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Constants, ReadStillImageFileValue, KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';
import { BookPart, Page } from '../../models/page.model';
import { FileRepresentation } from '../file-representation';
import { DspResource } from '../dsp-resource';
import { first, tap } from 'rxjs/operators';


@Component({
  selector: 'or-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.scss']
})
export class PageViewerComponent implements OnInit {
  @Input() pages: Observable<Page[]>;
  @Input() parts?: BookPart[] = [];
  @Input() id?: string = "iiif-viewer";
 
  allPages: Page[] = [];
  selectedPageNum = 1; // default value, so it visualizes the first scan when arriving on the page
  lastPage = 1

  // for viewer DataViz
  iiifURL:string = "https://iiif.ls-prod-server.dasch.swiss";
  project:string = "http://rdfh.ch/projects/QNSP2JJRTEyh6A0ZtpRdPQ";
  currentImage: FileRepresentation[] = [];
  images: FileRepresentation[] = [];
  
  // for the annotations e.g. regions in a still image representation
  annotationResources: DspResource[];
  resource: DspResource;
  pubIRI: string;

  constructor(
    public sanitizer: DomSanitizer,
    private knoraApiConnection: KnoraApiConnection
  ) { }

  ngOnInit(): void {
    let us = this;
    let first = true;
    this.pages
    .pipe(
      tap(
      pages => { 
        if (first) { 
          first = false;
          us.knoraApiConnection.v2.res
          .getResource(pages[0].id)
          .subscribe(
            (response: ReadResource) => {
              const res = new DspResource(response);
              us.currentImage = us.collectRepresentationsAndAnnotations(res);
            });
        }
      }),
    )
    .subscribe((pages: Page[]) => {
      // keep a copy of the pages
      this.allPages.push(...pages);
      this.lastPage = Math.max(1, this.allPages.length);
    });
  }

  selectOnChange(value: number) {
    let us = this;
    if (us.selectedPageNum != value) {
      us.selectedPageNum = value;
      us.knoraApiConnection.v2.res
      .getResource(us.allPages[value-1].id)
      .subscribe(
        (response: ReadResource) => {
          const res = new DspResource(response);
          us.currentImage = us.collectRepresentationsAndAnnotations(res);
        });
    }
  }


// FROM https://github.com/dasch-swiss/dsp-app/blob/9bb63d71234fc49f2afcb959603b8bcd4deb4429/src/app/workspace/resource/resource.component.ts#L355
// only taken a part of it relevant for still images

    /**
     * creates a collection of [[StillImageRepresentation]] belonging to the given resource and assigns it to it.
     * each [[StillImageRepresentation]] represents an image including regions.     *
     * @param resource The resource to get the images for.
     * @returns A collection of images for the given resource.
     */
     protected collectRepresentationsAndAnnotations(resource: DspResource): FileRepresentation[] {
      if (!resource) {
          return;
      }
      const representations: FileRepresentation[] = [];
          const fileValues: ReadStillImageFileValue[] = resource.res.properties[Constants.HasStillImageFileValue] as ReadStillImageFileValue[];
          for (const img of fileValues) {
  
              const stillImage = new FileRepresentation(img);
              representations.push(stillImage);
            }
  
      return representations;
  }
}
