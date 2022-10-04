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

  

  /* ------------------------------------------------------------------------------------
  quotePopup(el:ElementRef) {
    var quotes = Array.from(el.nativeElement.getElementsByClassName('tei-quote') as HTMLCollectionOf<HTMLElement>);
    for (let index = 0; index < quotes.length; index++) {
      // for each quote, declare a variable quote and a variable quoteNote (the note contains the source of the quote)
      const quote: HTMLElement = quotes[index];
      // to find the quote note, iterate over the children of quote and take the one with class = "tei-quote-note"
      const quoteNotes:any = quote.children      
      for (let index = 0; index < quoteNotes.length; index++) {
        if (quoteNotes[index].className == 'tei-quote-note') {
          const quoteNote = quoteNotes[index];
          // create icon node and add it at the end of quote
          if (!quote.textContent.includes("🕮")) {
            const sourceSpan = document.createElement("span");
            sourceSpan.textContent += " 🕮";
            quote.appendChild(sourceSpan);    
            // toggle on click (add or remove class "show" on click)
            sourceSpan.addEventListener('click', function openPopup() {
              quoteNote.classList.toggle("show");          
            });
          }
        }
      }
    }
  }
  */

  
 /* ------------------------------------------------------------------------------------*/
 quotePopup(el:ElementRef) {
  var quotes = Array.from(el.nativeElement.getElementsByClassName('tei-quote') as HTMLCollectionOf<HTMLElement>);
  for (let index = 0; index < quotes.length; index++) {
    // for each quote, declare a variable quote and a variable quoteNote (the note contains the source of the quote)
    const quote: HTMLElement = quotes[index];
    // to find the quote note, iterate over the children of quote and take the one with class = "tei-quote-note"
    const quoteNotes:any = quote.children      
    for (let index = 0; index < quoteNotes.length; index++) {
      if (quoteNotes[index].className == 'tei-quote-note') {
        const quoteNote = quoteNotes[index];
        // remove <br> before note, so the icon appears on the same line
        if (quoteNote.previousElementSibling) {
          if (quoteNote.previousElementSibling.nodeName == 'BR') {
            quoteNote.previousElementSibling.remove()
          }
        }
        // create icon node and add it at the end of quote
        if (!quote.textContent.includes("◂")) {
          const sourceSpan = document.createElement("span");
          sourceSpan.textContent += " ◂";
          quote.appendChild(sourceSpan);    
          // toggle on click (add or remove class "block" on click)
          sourceSpan.addEventListener('click', function show() {
            quoteNote.classList.toggle("block");          
          });
        }
      }
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



