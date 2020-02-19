import { Directive, ElementRef, Renderer2, AfterViewInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[orResourceLink]'
})
export class ResourceLinkDirective implements DoCheck {
          // AfterViewInit happens immediately after the component view is ready

  constructor(
    private el: ElementRef,
    private router: Router,
    private renderer: Renderer2  // Renderer2 makes it safer
  ) { }
          

  ngDoCheck():void {
    this.reRouteLink(this.el);  // use function, that is defined below
 }

 onClick(event) {
  this.router.navigate(['resources', event.target.getAttribute('href')]);
  event.preventDefault();
}

reRouteLink(el: ElementRef) {
  el.nativeElement.querySelectorAll('a').forEach((aElt: HTMLElement) => {
    // TODO: check that href contains IRI, because this is applied to all 'a'
    aElt.addEventListener('click', this.onClick.bind(this));
  });
}

 

}
