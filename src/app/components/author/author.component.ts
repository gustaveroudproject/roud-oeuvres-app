import { Component, OnChanges, Input } from '@angular/core';
import { AuthorLight } from 'src/app/models/author.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnChanges {

  author: AuthorLight;
  authors: AuthorLight[];
  
  @Input() authorsId: string[];

  constructor(private dataService: DataService) { }

  ngOnChanges() {

    /* on changes, because it is called also from components in components,
    like Book in PubPage, so does not work on init */

    this.authors = [];
    //// get authors from authors' IRIs
    for (var autVal in this.authorsId) {
      this.dataService
      .getAuthorLight(this.authorsId[autVal])
      .subscribe(
        (author: AuthorLight) => {
          this.author = author;
          this.authors.push(this.author);
          // it might be called more than once and add the same author multiple times 
          // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects 
          this.authors = this.authors.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);            
        }
      );
    }
  }
}
