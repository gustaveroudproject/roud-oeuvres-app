import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { MsPartLightWithStartingPageSeqnum } from 'src/app/models/manuscript.model';
import { Constants, ReadStillImageFileValue, KnoraApiConnection, ReadResource } from '@dasch-swiss/dsp-js';
import { BookPart, Page } from '../../models/page.model';
import { FileRepresentation } from '../file-representation';
import { DspResource } from '../dsp-resource';


@Component({
  selector: 'or-page-viewer',
  templateUrl: './page-viewer.component.html',
  styleUrls: ['./page-viewer.component.scss']
})
export class PageViewerComponent implements OnInit {
  @Input() pages: Observable<Page[]>;
  @Input() parts?: BookPart[] = [];
 
  allPages: Page[] = [];
  selectedPageNum: 1; // default value, so it visualizes the first scan when arriving on the page
  selectedPageNumberForwarder = new BehaviorSubject<number>(1);

  // for viewer DataViz
  iiifURL:string = "https://iiif.ls-prod-server.dasch.swiss";
  project:string = "http://rdfh.ch/projects/0112";
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
    this.pages.subscribe(
      (pages: Page[]) => {
        this.allPages.push(...pages);
        pages.map( (page) => {
          this.knoraApiConnection.v2.res
          .getResource(page.id)
          .subscribe(
            (response: ReadResource) => {
              const res = new DspResource(response);
              this.images = this.collectRepresentationsAndAnnotations(res);
            });
        })
      });
  }

  selectOnChange(value) {
    let us = this;
    if (us.selectedPageNum != value) {
      us.selectedPageNum = value;
      // pass it on still image viewer
      us.selectedPageNumberForwarder.next(value);
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
  
              //const regions: Region[] = [];
              const regions: any[] = [] // we do not have type Region
              const annotations: DspResource[] = [];
              /*  // comment out all about regions
              for (const incomingRegion of resource.incomingAnnotations) {
                  const region = new Region(incomingRegion);
                  regions.push(region);
                  const annotation = new DspResource(incomingRegion);
                  // gather region property information
                  annotation.resProps = this.initProps(incomingRegion);
                  // gather system property information
                  annotation.systemProps = incomingRegion.entityInfo.getPropertyDefinitionsByType(SystemPropertyDefinition);
                  annotations.push(annotation);
              }*/
              const stillImage = new FileRepresentation(img);
              representations.push(stillImage);
              this.annotationResources = annotations; 
              /* // comment out all about annotations and dsp-app interface
              if (this.valueUuid === 'annotations' || this.selectedRegion === this.resourceIri) {
                  this.selectedTab = (this.incomingResource ? 2 : 1);
                  this.selectedTabLabel = 'annotations';
              }*/
          }
  
      return representations;
  }
  
}
