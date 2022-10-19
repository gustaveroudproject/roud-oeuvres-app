// this component from https://github.com/dasch-swiss/dsp-app/tree/main/src/app/workspace/resource/representation/still-image


import { Component, OnInit } from '@angular/core';
import {
  AfterViewInit,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
// import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ApiResponseError,
  Constants,
  CreateColorValue,
  CreateGeomValue,
  CreateLinkValue,
  CreateResource,
  CreateTextValueAsString,
  KnoraApiConnection,
  Point2D,
  ReadColorValue,
  ReadFileValue,
  ReadGeomValue,
  ReadResource,
  ReadStillImageFileValue,
  RegionGeometry,
  UpdateFileValue,
  UpdateResource,
  UpdateValue,
  WriteValueResponse
} from '@dasch-swiss/dsp-js';
import * as OpenSeadragon from 'openseadragon';
import { FileRepresentation } from '../file-representation';
import { RepresentationService } from '../representation.service';


@Component({
  selector: 'or-still-image-too',
  templateUrl: './still-image-too.component.html',
  styleUrls: ['./still-image-too.component.scss']
})
export class StillImageTooComponent implements OnChanges, OnDestroy, AfterViewInit {

  

  @Input() images: FileRepresentation[];
  @Input() iiifUrl?: string;
  @Input() resourceIri: string;
  @Input() project: string;
  @Input() currentPage?: number;
  @Input() lastPage?: number;
  @Input() id?: string = "iiif-viewer";

  @Output() goToPage = new EventEmitter<number>();
  @Output() loaded = new EventEmitter<boolean>();

  loading = true;
  failedToLoad = false;
  originalFilename: string;

  // regionDrawMode = false; // stores whether viewer is currently drawing a region
  // private _regionDragInfo; // stores the information of the first click for drawing a region
  private _viewer: OpenSeadragon.Viewer;

  constructor(
      private readonly _http: HttpClient,
      //private _dialog: MatDialog,
      private _domSanitizer: DomSanitizer,
      private _elementRef: ElementRef,
      //private _errorHandler: ErrorHandlerService,
      // private _matIconRegistry: MatIconRegistry,
      //private _notification: NotificationService,
      private _renderer: Renderer2,
      private _rs: RepresentationService,
      //private _valueOperationEventService: ValueOperationEventService
  ) {
      OpenSeadragon.setString('Tooltips.Home', '');
      OpenSeadragon.setString('Tooltips.ZoomIn', '');
      OpenSeadragon.setString('Tooltips.ZoomOut', '');
      OpenSeadragon.setString('Tooltips.FullPage', '');
  }
  

  ngOnChanges(changes: SimpleChanges) {
      if (changes['images'] && changes['images'].isFirstChange()) {
          this._setupViewer();
      }
      if (changes['images']) {
          this._getOriginalFilename();

          this._openImages();
      }

  }

  ngAfterViewInit() {
      this.loaded.emit(true);
  }

  ngOnDestroy() {
      if (this._viewer) {
          this._viewer.destroy();
          this._viewer = undefined;
      }
  }

  /**
   * renders all ReadStillImageFileValues to be found in [[this.images]].
   * (Although this.images is an Angular Input property, the built-in change detection of Angular does not detect changes in complex objects or arrays, only reassignment of objects/arrays.
   * Use this method if additional ReadStillImageFileValues were added to this.images after creation/assignment of the this.images array.)
   */
  updateImages() {
      if (!this._viewer) {
          this._setupViewer();
      }
      this._openImages();
  }

  

  

  downloadFile(data) {
      const url = window.URL.createObjectURL(data);
      const e = document.createElement('a');
      e.href = url;

      // set filename
      if (this.originalFilename === undefined) {
          e.download = url.substr(url.lastIndexOf('/') + 1);
      } else {
          e.download = this.originalFilename;
      }

      document.body.appendChild(e);
      e.click();
      document.body.removeChild(e);
  }


  openImageInNewTab(url: string) {
      window.open(url, '_blank');
  }


  openPage(p: number) {
    console.log(`open page: wanted: ${p}, current: ${this.currentPage}, last: ${this.lastPage}`);
    
      this.goToPage.emit(p);
  }

  private _getOriginalFilename() {
      const requestOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          withCredentials: true
      };

      if (this.images && this.images.length>0) {
        const index = this.images[0].fileValue.fileUrl.indexOf(this.images[0].fileValue.filename);
        const pathToJson = this.images[0].fileValue.fileUrl.substring(0, index + this.images[0].fileValue.filename.length) + '/knora.json';
  
        this._http.get(pathToJson, requestOptions).subscribe(
            res => {
                this.originalFilename = res['originalFilename'];
            }
        );  
      }
  }

  

  /**
   * initializes the OpenSeadragon _viewer
   */
  private _setupViewer(): void {
      //const viewerContainer = this._elementRef.nativeElement.getElementById(this.id);
      //const viewerContainer = this._elementRef.nativeElement.getElementsByClassName('osd-container')[0];
      const viewerContainer = this._elementRef.nativeElement.getElementsByClassName('osd-container')[0];
      let osdOptions = {
          element: viewerContainer,
          id: this.id,
          sequenceMode: false,
          showReferenceStrip: true,
          zoomInButton: 'DSP_OSD_ZOOM_IN_TOO',
          zoomOutButton: 'DSP_OSD_ZOOM_OUT_TOO',
          previousButton: 'DSP_OSD_PREV_PAGE_TOO',
          nextButton: 'DSP_OSD_NEXT_PAGE_TOO',
          homeButton: 'DSP_OSD_HOME_TOO',
        //   fullPageButton: 'DSP_OSD_FULL_PAGE_'+this.id,
          fullPageButton: 'DSP_OSD_FULL_PAGE_TOO',
          // rotateLeftButton: 'DSP_OSD_ROTATE_LEFT',        // doesn't work yet
          // rotateRightButton: 'DSP_OSD_ROTATE_RIGHT',       // doesn't work yet
          showNavigator: true,
          navigatorPosition: 'ABSOLUTE' as const,
          navigatorTop: 'calc(100% - 136px)',
          navigatorLeft: 'calc(100% - 136px)',
          navigatorHeight: '120px',
          navigatorWidth: '120px',
          gestureSettingsMouse: {
              clickToZoom: false // do not zoom in on click
          }
      };
      console.log(osdOptions);
      
      this._viewer = new OpenSeadragon.Viewer(osdOptions);

      this._viewer.addHandler('full-screen', (args) => {
          if (args.fullScreen) {
              viewerContainer.classList.add('fullscreen');
          } else {
              viewerContainer.classList.remove('fullscreen');
          }
      });

  }

  /**
   * adds all images in this.images to the _viewer.
   * Images are positioned in a horizontal row next to each other.
   */
  private _openImages(): void {
      // imageXOffset controls the x coordinate of the left side of each image in the OpenSeadragon viewport coordinate system.
      // the first image has its left side at x = 0, and all images are scaled to have a width of 1 in viewport coordinates.
      // see also: https://openseadragon.github.io/examples/viewport-coordinates/

      // reset the status
      this.failedToLoad = false;

      const fileValues: ReadFileValue[] = this.images.map(
          img => img.fileValue
      );

      // display only the defined range of this.images
      const tileSources: object[] = this._prepareTileSourcesFromFileValues(fileValues);

      
      this._viewer.addOnceHandler('open', (args) => {
          // check if the current image exists
          if (this.iiifUrl.includes(args.source['@id'])) {
              this.failedToLoad = !this._rs.doesFileExist(args.source['@id'] + '/info.json');
              if (this.failedToLoad) {
                  // failed to laod
                  // disable mouse navigation incl. zoom
                  this._viewer.setMouseNavEnabled(false);
                  // disable the navigator
                  this._viewer.navigator.element.style.display = 'none';
                  // disable the region draw mode
                  // this.regionDrawMode = false;
                  // stop loading tiles
                  this._viewer.removeAllHandlers('open');
              } else {
                  // enable mouse navigation incl. zoom
                  this._viewer.setMouseNavEnabled(true);
                  // enable the navigator
                  this._viewer.navigator.element.style.display = 'block';
              }
              this.loading = false;
          }
      });

      this._viewer.open(tileSources);
  }

  /**
   * prepare tile sources from the given sequence of [[ReadFileValue]].
   *
   * @param imagesToDisplay the given file values to de displayed.
   * @returns the tile sources to be passed to OSD _viewer.
   */
  private _prepareTileSourcesFromFileValues(imagesToDisplay: ReadFileValue[]): object[] {
      const images = imagesToDisplay as ReadStillImageFileValue[];

      let imageXOffset = 0;
      const imageYOffset = 0;
      const tileSources = [];

      // let i = 0;

      for (const image of images) {
          const sipiBasePath = image.iiifBaseUrl + '/' + image.filename;
          const width = image.dimX;
          const height = image.dimY;
          // construct OpenSeadragon tileSources according to https://openseadragon.github.io/docs/OpenSeadragon.Viewer.html#open
          tileSources.push({
              // construct IIIF tileSource configuration according to https://iiif.io/api/image/3.0
              tileSource: {
                  '@context': 'http://iiif.io/api/image/3/context.json',
                  'id': sipiBasePath,
                  height: height,
                  width: width,
                  profile: ['level2'],
                  protocol: 'http://iiif.io/api/image',
                  tiles: [{
                      scaleFactors: [1, 2, 4, 8, 16, 32],
                      width: 1024
                  }]
              },
              x: imageXOffset,
              y: imageYOffset,
              preload: true
          });

          imageXOffset++;
      }

      return tileSources;
  }

 


}
