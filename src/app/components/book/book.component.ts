import { Component, OnInit, Input } from '@angular/core';
import { Book } from 'src/app/models/publication.model';
import { PublisherLight } from 'src/app/models/publisher.model'
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'or-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  book: Book;
  publisherLight: PublisherLight;

  @Input()
  bookIRI: string ;
  @Input()
  withAuthor: string;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {

    console.log(this.withAuthor);
    
    this.dataService
      .getBook(this.bookIRI)
      .subscribe(
        (book: Book) => {
          this.book = book;

          // asynchrone
          this.dataService
          .getPublisherLight(book.publisherValue)
          .subscribe(
            (publisherLight: PublisherLight) => {
            this.publisherLight = publisherLight;
            });

        },
        error => console.error(error)
      );
  }  
}



