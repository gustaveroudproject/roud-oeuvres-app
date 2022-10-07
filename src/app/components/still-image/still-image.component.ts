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
import { mergeMap } from 'rxjs/operators';
//import { DspApiConnectionToken } from 'src/app/main/declarations/dsp-api-tokens';
//import { DialogComponent } from 'src/app/main/dialog/dialog.component';
//import { ErrorHandlerService } from 'src/app/main/services/error-handler.service';
//import { NotificationService } from 'src/app/main/services/notification.service';
import { DspCompoundPosition } from '../dsp-resource';
//import { EmitEvent, Events, UpdatedFileEventValue, ValueOperationEventService } from '../../services/value-operation-event.service';
import { FileRepresentation } from '../file-representation';
import { RepresentationService } from '../representation.service';


@Component({
  selector: 'or-still-image',
  templateUrl: './still-image.component.html',
  styleUrls: ['./still-image.component.scss']
})
export class StillImageComponent implements OnChanges, OnDestroy, AfterViewInit {

  

  @Input() images: FileRepresentation[];
  // @Input() imageCaption?: string;
  @Input() iiifUrl?: string;
  @Input() resourceIri: string;
  // @Input() project: string;
  // @Input() activateRegion?: string; // highlight a region
  @Input() compoundNavigation?: DspCompoundPosition;
  // @Input() currentTab: string;
  // @Input() parentResource: ReadResource;

  @Output() goToPage = new EventEmitter<number>();

  // @Output() regionClicked = new EventEmitter<string>();

  // @Output() regionAdded = new EventEmitter<string>();

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

      // own draw region icon; because it does not exist in the material icons
      /*
      this._matIconRegistry.addSvgIcon(
          'draw_region_icon',
          this._domSanitizer.bypassSecurityTrustResourceUrl('/assets/images/draw-region-icon.svg')
      );
      */
  }
  

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.images)
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
      // this.regionDrawMode = false;
      this.goToPage.emit(p);
  }

  private _getOriginalFilename() {
      const requestOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          withCredentials: true
      };

      const index = this.images[0].fileValue.fileUrl.indexOf(this.images[0].fileValue.filename);
      const pathToJson = this.images[0].fileValue.fileUrl.substring(0, index + this.images[0].fileValue.filename.length) + '/knora.json';

      this._http.get(pathToJson, requestOptions).subscribe(
          res => {
              this.originalFilename = res['originalFilename'];
          }
      );
  }

  

  /**
   * initializes the OpenSeadragon _viewer
   */
  private _setupViewer(): void {
      const viewerContainer = this._elementRef.nativeElement.getElementsByClassName('osd-container')[0];
      const osdOptions = {
          element: viewerContainer,
          sequenceMode: false,
          showReferenceStrip: true,
          zoomInButton: 'DSP_OSD_ZOOM_IN',
          zoomOutButton: 'DSP_OSD_ZOOM_OUT',
          previousButton: 'DSP_OSD_PREV_PAGE',
          nextButton: 'DSP_OSD_NEXT_PAGE',
          homeButton: 'DSP_OSD_HOME',
          fullPageButton: 'DSP_OSD_FULL_PAGE',
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
