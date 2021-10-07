import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Work } from 'src/app/models/work.model';
import { DataService } from 'src/app/services/data.service';
import { TextLight } from 'src/app/models/text.model';
import { AuthorLight } from 'src/app/models/author.model';



@Component({
  selector: 'or-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})
export class WorkPageComponent implements OnInit {

  work: Work;
  textsLight : TextLight[];
  workAuthor: AuthorLight;
  workAuthors: AuthorLight[];

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute // it gives me the current route (URL)
  ) { }

  ngOnInit() {

    //1. recuperer IRI du URL courent (ActivatedRoute)
    //2. recuperer la ressource de Knora
    //3. construire un objet de la classe work
    //4. l'affecter à cette variable

    this.route.paramMap.subscribe(
      params => {
        this.dataService
          .getWork(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .subscribe(
            (work: Work) => {
              this.work = work; // step 4    

              
                //// get authors from authors' IRIs
                this.workAuthors = [];
                for (var autVal in work.authorsValues) {
                  this.dataService
                  .getAuthorLight(work.authorsValues[autVal])
                  .subscribe(
                    (workAuthor: AuthorLight) => {
                      this.workAuthor = workAuthor;
                      this.workAuthors.push(workAuthor);
                    });
                  }

              
                

              // asynchrone, we need text to ask texts mentioning the work
              this.dataService
              .getTextsMentioningWorks(work.id)
              .subscribe((textsLight: TextLight[]) => {
                this.textsLight = textsLight;
                // console.log(textsLight);
                });

              



            },
              
            error => console.error(error)
          );
    },
    error => console.error(error)
  );
}
}