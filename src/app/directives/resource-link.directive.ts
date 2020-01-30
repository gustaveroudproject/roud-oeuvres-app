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
    this.renderer.setAttribute(aElt, 'href',`/resources/${encodedIRI}`); // assign @href it a value equal to 'resources/' + var IRI
    this.renderer.removeAttribute(aElt, 'class'); // delete @class
  });

}
}
