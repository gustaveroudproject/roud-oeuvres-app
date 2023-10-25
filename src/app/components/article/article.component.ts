import { Component, OnInit, Input } from '@angular/core';
import { PeriodicalArticle } from 'src/app/models/publication.model';
import { PeriodicalLight } from 'src/app/models/periodical.model'
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {

  article: PeriodicalArticle;
  periodical: PeriodicalLight;

  @Input()
  articleIRI: string ;
  @Input()
  withAuthor: string;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {

    this.dataService
      .getPeriodicalArticle(this.articleIRI)
      .subscribe(
        (article: PeriodicalArticle) => {
          this.article = article;

          // asynchrone
          this.dataService
          .getPeriodicalLight(article.periodicalValue)
          .subscribe(
            (periodical: PeriodicalLight) => {
            this.periodical = periodical;
            });

        },
        error => console.error(error)
      );
  }  
}



