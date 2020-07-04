import { Directive, ElementRef, DoCheck } from '@angular/core';
import { DataService } from '../services/data.service';
import { PublicationLight } from '../models/publication.model';

@Directive({
  selector: '[orRenderTei]'
})

export class RenderTeiDirective implements DoCheck {

  sourceLight: PublicationLight;

  constructor(
    private el: ElementRef,
    private dataService: DataService
  ) { }
          
  
  ngDoCheck():void {
    this.linkInheritColor(this.el);
    this.quote(this.el);
  }


 

  /* ------------------------------------------------------------------------------------*/
  linkInheritColor(el: ElementRef){
    var links = Array.from(el.nativeElement.getElementsByClassName('resourceLink') as HTMLCollectionOf<HTMLLinkElement>);
    for (let index = 0; index < links.length; index++) {
      const link: HTMLLinkElement = links[index];
      link.style.color = "inherit";
    }
  }




  /* ------------------------------------------------------------------------------------*/
  quote(el:ElementRef) {
    
    var quotes = Array.from(el.nativeElement.getElementsByClassName('tei-quote') as HTMLCollectionOf<HTMLLinkElement>);
    for (let index = 0; index < quotes.length; index++) {
      
    const quote: HTMLLinkElement = quotes[index];
    quote.style.display = "block";
    quote.style.paddingLeft = "50px";

    // happens only once
    if (quote.className != "sourceAdded") {

      quote.setAttribute("class", "sourceAdded");
      
      
      //undo everything that has been done by the directive orResourceLink ... 
      const iri: string = quote.href.split('resources/')[1];
      const decodedIri: string = decodeURIComponent(iri);
      const encodedIri: string = encodeURIComponent(iri);
      
      this.dataService
      .getPublicationLight(decodedIri)
      .subscribe((sourceLight: PublicationLight) => {
        this.sourceLight = sourceLight;

        const sourceTitle = sourceLight.title;

        quote.insertAdjacentHTML("beforeend", ` <a href="${encodedIri}">&#128366;</a>`);
        // ADD TOOLTIP <span>${sourceTitle}</span> 
      });

      quote.removeAttribute("href");

      
    }
    // indent
    
    /*
    // if there is no child, i.e. if the node hasn't been already created on DoCheck
    // (it does not work with other lifecycle events)
    if (quote.children.length == 0) {
      const iri: string = encodeURIComponent(quote.href);
      var newItem = document.createElement("span"); 
      var textnode = document.createTextNode("[" + iri + "]");
      newItem.appendChild(textnode);
      quote.insertBefore(newItem, quote.childNodes[0]);  
      quote.insertAdjacentText("afterend", ` [${iri}]`)
    };
    */
    };
    
  }
  

}



