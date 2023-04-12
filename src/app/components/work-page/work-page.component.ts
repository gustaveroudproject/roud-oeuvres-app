import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Work } from 'src/app/models/work.model';
import { DataService } from 'src/app/services/data.service';
import { Text } from 'src/app/models/text.model';
import { AuthorLight } from 'src/app/models/author.model';
import { finalize } from 'rxjs/operators';



@Component({
  selector: 'or-work-page',
  templateUrl: './work-page.component.html',
  styleUrls: ['./work-page.component.scss']
})
export class WorkPageComponent implements OnInit {

  work: Work;
  mentioningTexts : Text[];
  workAuthor: AuthorLight;
  workAuthors: AuthorLight[];

  loadingResults = 0;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute // it gives me the current route (URL)
  ) { }

  finalizeWait() {
    this.loadingResults--;
    console.log("finalize: "+ this.loadingResults);
  }

  ngOnInit() {

    //1. recuperer IRI du URL courent (ActivatedRoute)
    //2. recuperer la ressource de Knora
    //3. construire un objet de la classe work
    //4. l'affecter à cette variable

    this.route.paramMap
    .pipe(finalize(() => this.finalizeWait()))
    .subscribe(
      params => {
        this.loadingResults++;
        this.dataService
          .getWork(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .pipe(finalize(() => this.finalizeWait()))
          .subscribe(
            (work: Work) => {
              this.work = work; // step 4    

              
                //// get authors from authors' IRIs
                this.workAuthors = [];
                for (var autVal in work.authorsValues) {
                  this.loadingResults++;
                  this.dataService
                  .getAuthorLight(work.authorsValues[autVal])
                  .pipe(finalize(() => this.finalizeWait()))
                  .subscribe(
                    (workAuthor: AuthorLight) => {
                      this.workAuthor = workAuthor;
                      this.workAuthors.push(workAuthor);
                    });
                  }

              
                

              // asynchrone, we need text to ask texts mentioning the work
              this.loadingResults++;
              this.dataService
              .getTextsMentioningWorks(work.id)
              .pipe(finalize(() => this.finalizeWait()))
              .subscribe((mentioningTexts: Text[]) => {
                this.mentioningTexts = mentioningTexts;
                // console.log(mentioningTexts);
                });

              



            },
              
            error => console.error(error)
          );
    },
    error => console.error(error)
  );
}
}