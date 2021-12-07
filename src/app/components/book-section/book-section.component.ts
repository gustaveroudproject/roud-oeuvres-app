import { Component, OnInit, Input } from '@angular/core';
import { BookSection } from 'src/app/models/publication.model';
import { PublisherLight } from 'src/app/models/publisher.model'
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-book-section',
  templateUrl: './book-section.component.html',
  styleUrls: ['./book-section.component.scss']
})
export class BookSectionComponent implements OnInit {
  
  bookSection: BookSection;
  publisherLight: PublisherLight;

  @Input()
  bookSectionIRI: string ;

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit() {
    
    this.dataService
      .getBookSection(this.bookSectionIRI)
      .subscribe(
        (bookSection: BookSection) => {
          this.bookSection = bookSection;

          // asynchrone
          this.dataService
          .getPublisherLight(bookSection.publisherValue)
          .subscribe(
            (publisherLight: PublisherLight) => {
            this.publisherLight = publisherLight;
            });

        },
        error => console.error(error)
      );
  }  
}


