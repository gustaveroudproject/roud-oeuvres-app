import { Component, OnInit, Input } from '@angular/core';
import { BookSection } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-book-section',
  templateUrl: './book-section.component.html',
  styleUrls: ['./book-section.component.scss']
})
export class BookSectionComponent implements OnInit {
  
  bookSection: BookSection;
  // not used
  // publisherLight: PublisherLight;

  @Input() bookSectionIRI: string;
  @Input() withAuthor: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService
      .getBookSection(this.bookSectionIRI)
      .subscribe(
        (bookSection: BookSection) => {
          this.bookSection = bookSection;
          // not used
          // if (bookSection.publisherValue != null) {
          //   // asynchrone
          //   this.dataService
          //   .getPublisherLight(bookSection.publisherValue)
          //   .subscribe(
          //     (publisherLight: PublisherLight) => {
          //     this.publisherLight = publisherLight;
          //     });
          // }
        },
        error => console.error(error)
      );
  }  
}
