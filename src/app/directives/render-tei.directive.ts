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
        
        // retrieve bibliographical reference of source
        this.dataService
        .getPublicationLight(decodedIri)
        .subscribe((sourceLight: PublicationLight) => {
          this.sourceLight = sourceLight;

          const sourceTitle = (sourceLight.title).replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<text><p>", "")
          .replace("</p></text>", "");

          const sourceDate = sourceLight.date;
        
        // add icon, with tooltip and link to biblio ref
        quote.insertAdjacentHTML("beforeend", 
          ` <a  data-toggle="tooltip" data-placement="top" 
          title="${sourceTitle} (${sourceDate})" href="${encodedIri}">&#128366;</a>`); 
        });

        // remove href behaviour to entire quote
        quote.removeAttribute("href");
      }
    };
    
  };
  

}



