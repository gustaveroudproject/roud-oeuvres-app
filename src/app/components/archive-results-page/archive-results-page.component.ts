/// OBSOLETE COMPONENT
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuthorLight } from 'src/app/models/author.model';
import { MsLight } from 'src/app/models/manuscript.model';


@Component({
  selector: 'or-archive-results-page',
  templateUrl: './archive-results-page.component.html',
  styleUrls: ['./archive-results-page.component.scss']
})
export class ArchiveResultsPageComponent implements OnInit {

  translatedAuthorIRI: string;
  translatedAuthor: AuthorLight;
  mssTranslatedAuthor: MsLight[];

  mssDiaryDate: MsLight[];
  mssDiaryEstablishedDate: MsLight[];
  mssDiaryYears: any;
  
  years: string;
  titleYears: string;

  constructor(private dataService: DataService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams
    .subscribe(params => { 
      this.translatedAuthorIRI = params.translatedAuthorIRI;
      this.years = params.years;

      if (this.translatedAuthorIRI != null) {
        this.dataService.getAuthorLight(this.translatedAuthorIRI).subscribe(
          (translatedAuthor: AuthorLight) => {
            this.translatedAuthor = translatedAuthor;
          }
        );
        this.dataService.getMssTranslatedAuthor(this.translatedAuthorIRI).subscribe(
          (mssTranslatedAuthor: MsLight[]) => {
            this.mssTranslatedAuthor = mssTranslatedAuthor;
          }
        );
      }

      if (this.years != null) {

        this.titleYears = this.years.slice(10).replace(":", "–");
        
        this.mssDiaryYears = [];

        this.dataService.getDiaryMssDate(this.years).subscribe(
          (mssDiaryDate: MsLight[]) => {
            this.mssDiaryDate = mssDiaryDate;
            this.mssDiaryYears = [ ...this.mssDiaryYears, ...mssDiaryDate];
          }
        );

        this.dataService.getDiaryMssEstablishedDate(this.years).subscribe(
          (mssDiaryEstablishedDate: MsLight[]) => {
            this.mssDiaryEstablishedDate = mssDiaryEstablishedDate;
            this.mssDiaryYears = [ ...this.mssDiaryYears, ...mssDiaryEstablishedDate];
          }
        );
      }
    }
  );
  }
}
