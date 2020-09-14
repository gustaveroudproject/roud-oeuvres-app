/*
NEW VERSION (see below for Old version)
It replaces the value of @href (which is an IRI) of all <a> with class="resourceLink" or "salsah-link" with
"resources/theEncodedIri", adding resources.
The rest is the same as in the older version, which was better but sometimes did not work.
*/

import { Directive, ElementRef, DoCheck } from '@angular/core';

@Directive({
  selector: '[orResourceLink]'
})

export class ResourceLinkDirective implements DoCheck {
  constructor(
    private el: ElementRef
  ) { }
          
  ngDoCheck():void {
    this.reRouteResourceLink(this.el);  // use function, that is defined below
    this.reRouteSalsahLink(this.el);  // use function, that is defined below
 }
 
  reRouteResourceLink(el: ElementRef) {
    var links = Array.from(el.nativeElement.getElementsByClassName('resourceLink') as HTMLCollectionOf<HTMLLinkElement>);
    for (let index = 0; index < links.length; index++) {
      const link: HTMLLinkElement = links[index];
      var iri = encodeURIComponent(link.href);
      if (! (iri.includes("resources"))) {
        link.setAttribute("href", `resources/${iri}`);
      };
    }
  }

  reRouteSalsahLink(el: ElementRef) {
    var links = Array.from(el.nativeElement.getElementsByClassName('salsah-link') as HTMLCollectionOf<HTMLLinkElement>);
    for (let index = 0; index < links.length; index++) {
      const link: HTMLLinkElement = links[index];
      var iri = encodeURIComponent(link.href);
      if (! (iri.includes("resources"))) {
        link.setAttribute("href", `resources/${iri}`);
      };
    }
  }

}





/*
OLD VERSION, COMMENTED OUT NOW:

Used, for example, in person-view (notice) and in the texts content.

- It takes all the links inside a text
  (all the link with class = resourceLink, as in texts, or salsah-link, as in other classes)
  and sets the router as 'resources'.
- Then, not here but in app-routing module, redirects to the right component for the right class

Example:
1. In TEI
<placeName knoraLink="http://rdfh.ch/0112/6E2ONBGbQCu37Hepso8ZLQ" ref="http://rdfh.ch/0112/6E2ONBGbQCu37Hepso8ZLQ">Kunstmuseum de Zurich</placeName>
2. After XSL transformation
<a class="resourceLink" href="http://rdfh.ch/0112/6E2ONBGbQCu37Hepso8ZLQ">Kunstmuseum de Zurich</a>
3. Here
<a class="resourceLink" href="resources/http://rdfh.ch/0112/6E2ONBGbQCu37Hepso8ZLQ">Kunstmuseum de Zurich</a>
4. When the link is clicked, app-routing module calls resource-router component,
which identifies the class of the IRI and redirects to, for example, places/IRI

AfterContentChecked, AfterViewChecked, DoCheck work INTERMITTENTLY (see mss comments).
Only DoCheck is also for directives: <https://v2.angular.io/docs/ts/latest/guide/lifecycle-hooks.html#!#hooks-purpose-timing> 
OnInit, AfterContentInit, AfterViewInit, OnChanges do NOT work.
It works only when many links are created, because of DoCheck? NO!
*/



/* CODE

//import { Router } from '@angular/router';

//private router: Router,
//private renderer: Renderer2  // Renderer2 makes it safer

reRouteLink(el: ElementRef) {
  el.nativeElement.querySelectorAll('a[class="resourceLink"], a[class="salsah-link"]').forEach((aElt: HTMLElement) => {
    // console.log(aElt);
    // gives back an array of <a class="resourceLink">
    aElt.addEventListener('click', this.onClick.bind(this)); 
    //intercept click and call the following function, that navigates
  });
}

onClick(event) {
  this.router.navigate(['resources', event.target.getAttribute('href')]);
  event.preventDefault();
}

*/

