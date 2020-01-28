import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Resource } from 'src/app/models/resource.model'


@Component({
  selector: 'or-resource-router',
  templateUrl: './resource-router.component.html',
  styleUrls: ['./resource-router.component.scss']
})

export class ResourceRouterComponent implements OnInit {
  resources: Resource[];
  selectedResource: Resource;
  constructor(
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    //private knoraService: KnoraV2Service
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params);
      if (params.has('iri')) {
        const iri = decodeURIComponent(params.get('iri'));
        console.log(iri);
        const routeMapping = new Map<string, string>();
        routeMapping.set('Person', '/persons/');
        routeMapping.set('Place', '/places/');
        routeMapping.set('Manuscript', '/manuscripts/');
        routeMapping.set('EstablishedText', '/texts/');
        routeMapping.set('Work', '/works/');


 
        this.dataService.getResources().subscribe(
          (resources: Resource[]) => {
          this.resources = resources;
          },
          error => console.error(error)
        );
    
          this.route.paramMap.subscribe(
            params => {
              if (params.has('iri')) {
                this.dataService
                .getResource(decodeURIComponent(params.get('iri')))
                .subscribe(
                  (resource: Resource) => {
                    this.selectedResource = resource;
                  },
                  error => console.error(error)
                );
            }
        },
        error => console.error(error)
        );

        // where to use the resourceClassLabel implemented in resource.model?

        /*
        this.knoraService.getResource(iri).subscribe((res: KResource) => {
          console.log(res);
          const routeKey = res
            ? Array.from(routeMapping.keys()).find(k => res.type.endsWith(k))
            : null;
          console.log(routeKey);

          if (routeKey) {
            this.router.navigate([
              routeMapping.get(routeKey),
              encodeURIComponent(iri)
            ]);
          }
        }); */
      }
    });
  }
}
