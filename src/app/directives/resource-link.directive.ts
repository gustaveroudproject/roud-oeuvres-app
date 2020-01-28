import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[orResourceLink]'
})
export class ResourceLinkDirective implements AfterViewInit {
          // AfterViewInit happens immediately after the component view is ready

  constructor(
    private el: ElementRef,
    private renderer: Renderer2  // Renderer2 makes it safer
  ) { }
          

  ngAfterViewInit():void {
    this.replaceLink(this.el);  // use function, that is defined below
 }

 replaceLink(el: ElementRef) {
   
  el.nativeElement.querySelectorAll('a').forEach((aElt: HTMLElement) => {
    const IRI = aElt.attributes['href'].value;  // record in a variable IRI the value of @href
    const encodedIRI = encodeURIComponent(IRI);
    this.renderer.setAttribute(aElt, 'routerLink',`/resources/${encodedIRI}`); // create new attribute @routerLink and assign it a value equal to 'resources/' + var IRI
    this.renderer.removeAttribute(aElt, 'href');  // delete original @href
    this.renderer.removeAttribute(aElt, 'class'); // delete @class

    /*
   Something like this would work if we need to change attributes on an element that is in the html
      this.renderer.setAttribute(this.el.nativeElement, 'routerLink', 'IRI');
      this.renderer.removeAttribute(this.el.nativeElement, 'class');
   But it's not fine here, because we want to change an attribute that is inside an innerHTML sent from db
   */

  });

}
}
