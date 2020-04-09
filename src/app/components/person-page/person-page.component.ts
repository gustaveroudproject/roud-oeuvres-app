import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { TextLight } from 'src/app/models/text.model';

@Component({
  selector: 'or-person-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.scss']
})
export class PersonPageComponent implements OnInit {
  
  person: Person;
  textsLight : TextLight[];


  constructor(
    private dataService: DataService,
    private route: ActivatedRoute // it gives me the current route (URL)
  ) {}

  ngOnInit() {

    //1. recuperer IRI du URL courent (ActivatedRoute)
    //2. recuperer la ressource de Knora
    //3. construire un objet de la classe person
    //4. l'affecter à cette variable

    this.route.paramMap.subscribe(
      params => {
        this.dataService
          .getPerson(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .subscribe(
            (person: Person) => {
              this.person = person; // step 4    I give to the attribute person the value of person


                // console.log(person.Viaf != null)

                // asynchrone, we need text to ask texts mentioning persons
                this.dataService
                .getTextsMentioningPersons(person.id)
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
