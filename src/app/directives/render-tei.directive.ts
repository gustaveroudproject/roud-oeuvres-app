import { Directive, ElementRef, AfterContentChecked } from '@angular/core';
import { DataService } from '../services/data.service';
import { PublicationLight } from '../models/publication.model';

@Directive({
  selector: '[orRenderTei]'
})

export class RenderTeiDirective implements AfterContentChecked {

  sourceLight: PublicationLight;

  constructor(
    private el: ElementRef,
    private dataService: DataService
  ) { }
         
  

  ngAfterContentChecked():void {
    this.quotePopup(this.el);
    this.linkInheritColor(this.el);
  }

  


 

  /* ------------------------------------------------------------------------------------*/
  linkInheritColor(el: ElementRef){
    var links = Array.from(el.nativeElement.getElementsByClassName('resourceLink') as HTMLCollectionOf<HTMLLinkElement>);
    for (let index = 0; index < links.length; index++) {
      const link: HTMLLinkElement = links[index];
      link.style.color = "inherit";
    }
  }


  quotePopup(el:ElementRef) {
    var quotes = Array.from(el.nativeElement.getElementsByClassName('tei-quote') as HTMLCollectionOf<HTMLElement>);
    for (let index = 0; index < quotes.length; index++) {
      // for each quote, declare a variable quote and a variable quoteNote (the note contains the source of the quote)
      const quote: HTMLElement = quotes[index];
      const quoteNote:any = quote.children[0];
      
      // create book symbol node and add it and the end of quote
      if (!quote.textContent.includes("🕮")) {
        const sourceSpan = document.createElement("span");
        sourceSpan.textContent += " 🕮";
        quote.appendChild(sourceSpan);

        // make the book clickable to open popup
        sourceSpan.addEventListener('click', function openPopup() {
          if (quoteNote.getAttribute('style').includes('hidden') == true){
            /* quoteNote.classList.toggle("show");
            the problem with toggle the class is that it does not seem to read what's written in scss
            when the class is activated. But where else to declare it?
            */
            
            // make it visible, the value of this property was 'hidden'
            quoteNote.style.visibility = "visible";
            
            // style the popup
            quoteNote.style.backgroundColor = "black"; // should be ok also in dark mode in readers control
            quoteNote.style.color = "white";
            quoteNote.style.borderRadius = "6px";
            quoteNote.style.padding = "8px";
            quoteNote.style.left = "20%";

            // create closing X in a div and add it to the popup
            if (!quoteNote.textContent.includes("X")) {
              var div = document.createElement("div");
              div.textContent += "X";
              div.style.textAlign = "right";
              div.addEventListener('click', function closePopup() {
                quoteNote.style.visibility = "hidden";
              });
              quoteNote.appendChild(div);
            }
          }
        });
      }
    }
  }

  



  /* ------------------------------------------------------------------------------------*/
  /*
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
  */
  

}



