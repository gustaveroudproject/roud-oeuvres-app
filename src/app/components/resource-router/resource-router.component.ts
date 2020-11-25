import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { Resource } from 'src/app/models/resource.model';

@Component({
  template: '' // one could write the html part of the component here, but in this case we don't need any html
})
export class ResourceRouterComponent implements OnInit {
  resources: Resource[];
  selectedResource: Resource;
  constructor(
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    // get iri
    this.route.paramMap.subscribe(params => {
      // console.log(params);
      // I can have iri here, because in routing the path is defined resources:iri
      if (params.has('iri')) {
        const routeMapping = new Map<string, string>();
        routeMapping.set('Person', '/persons/');
        routeMapping.set('Place', '/places/');
        routeMapping.set('Established text', '/texts/');
        routeMapping.set('Work', '/works/');
        routeMapping.set('Periodical article', '/archive/pub/');
        routeMapping.set('Book', '/archive/pub/');
        routeMapping.set('Book section', '/archive/pub/');
        routeMapping.set('Archival document', '/archive/ms/');

        // get resource class
        this.route.paramMap.subscribe(
          params => {
            if (params.has('iri')) {
              
              // if iri has fragment, iri changes value
              var iri = decodeURIComponent(params.get('iri'));
              var fragment = decodeURIComponent(params.get('iri'));
              if (iri.includes('#')) {
                var iri = iri.split('#')[0]; 
                var fragment = fragment.split('#')[1]; 
              }
              
              // pass directly the decodedIri to the query
              this.dataService
                .getResource(iri)
                .subscribe(
                  (resource: Resource) => {
                       // console.log(resource.resourceClassLabel);
                    if (routeMapping.has(resource.resourceClassLabel)) {
                      // if the class is in the dictionary
                      const resRoutePrefix = routeMapping.get(
                        // give me the value of this key (e.g., the key is "Place" and the value is "/places/")
                        resource.resourceClassLabel
                      );
                      
                      // we use router to navigate, where? To the route mapped,
                      // which is made of resRoutePrefix + encodeURIComponent(iri) + fragment, if any
                      this.router.navigate([
                        resRoutePrefix, // is not a string that we give, but a table, so we use ","
                        encodeURIComponent(iri)],
                        {fragment: fragment});
                        // see https://angular.io/api/router/NavigationExtras#fragment

                    } else {
                      console.log(
                        'No route for class ' + resource.resourceClassLabel
                      );
                      this.router.navigate(['not-found']);
                    }
                  },
                  error => console.error(error)
                );
            }
          },
          error => console.error(error)
        );
      }
    });
  }
}
