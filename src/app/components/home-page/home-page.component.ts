import { Component, OnInit } from '@angular/core';
import { Constants, KnoraApiConnection, ReadResource, ReadStillImageFileValue } from '@dasch-swiss/dsp-js';
import { DataService } from 'src/app/services/data.service';
import { DspResource } from '../dsp-resource';
import { FileRepresentation } from '../file-representation';

@Component({
  selector: 'or-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  // for viewer
  iiifURL:string = "https://iiif.ls-prod-server.dasch.swiss";
  projectIri:string = "http://rdfh.ch/projects/0112";
  dataVizIri_PourUnMoissonneur: string = "http://rdfh.ch/0112/GhBbXbUvQWKfswctMiieGg"
  images: FileRepresentation[] = [];
  // for the annotations e.g. regions in a still image representation
  annotationResources: DspResource[];
  resource: DspResource;



  constructor(

    private dataService: DataService,
    private knoraApiConnection: KnoraApiConnection,
  ) {}

  ngOnInit() {

      this.knoraApiConnection.v2.res
      .getResource(this.dataVizIri_PourUnMoissonneur)
      .subscribe(
        (response: ReadResource) => {
          const res = new DspResource(response);
          this.resource = res;
      
          this.images = this.collectRepresentationsAndAnnotations(this.resource);
        });
  }



// see pub-page.ts 
  protected collectRepresentationsAndAnnotations(resource: DspResource): FileRepresentation[] {
      if (!resource) {
          return;
      }
      const representations: FileRepresentation[] = [];
          const fileValues: ReadStillImageFileValue[] = resource.res.properties[Constants.HasStillImageFileValue] as ReadStillImageFileValue[];
          for (const img of fileValues) {
              const regions: any[] = [] 
              const annotations: DspResource[] = [];
              const stillImage = new FileRepresentation(img);
              representations.push(stillImage);
              this.annotationResources = annotations; 
          }
      return representations;
  }

  
}



