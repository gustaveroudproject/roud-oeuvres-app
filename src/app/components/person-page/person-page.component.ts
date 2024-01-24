import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Text } from 'src/app/models/text.model';
import { Picture } from 'src/app/models/picture.model';
import { DomSanitizer } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'or-person-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.scss']
})
export class PersonPageComponent implements OnInit {
  
  person: Person;
  mentioningTexts : Text[];
  pictures : Picture[];

  loadingResults = 0;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute, // it gives me the current route (URL)
    public sanitizer: DomSanitizer
  ) { }

  finalizeWait() {
    this.loadingResults--;
    console.log("finalize: "+ this.loadingResults);
  }

  ngOnInit() {

    //1. recuperer IRI du URL courent (ActivatedRoute)
    //2. recuperer la ressource de Knora
    //3. construire un objet de la classe person
    //4. l'affecter à cette variable

    this.route.paramMap
    .pipe(finalize(() => this.finalizeWait()))
    .subscribe(
      params => {
        this.loadingResults++;
        this.dataService
          .getPerson(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .pipe(finalize(() => this.finalizeWait()))
          .subscribe(
            (person: Person) => {
              this.person = person; // step 4    I give to the attribute person the value of person

                // console.log(person.Viaf != null)

                // asynchrone, we need text to ask texts mentioning persons
                this.loadingResults++;
                this.dataService
                .getTextsMentioningPersons(person.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe((mentioningTexts: Text[]) => {
                  this.mentioningTexts = mentioningTexts;
                  // console.log(mentioningTexts);
                });
                
                this.loadingResults++;
                this.dataService
                .getPicturesOfPerson(person.id)
                .pipe(finalize(() => this.finalizeWait()))
                .subscribe((pictures: Picture[]) => {
                  this.pictures = pictures;
                  // console.log(pictures);
                });
              },
              error => console.error(error)
            );
      },
      error => console.error(error)
    );
  }
}
