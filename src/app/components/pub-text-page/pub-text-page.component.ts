import { Component, OnInit } from '@angular/core';
import { PublicationLight } from 'src/app/models/publication.model';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute } from '@angular/router';
import { AuthorLight } from 'src/app/models/author.model';

@Component({
  selector: 'or-pub-text-page',
  templateUrl: './pub-text-page.component.html',
  styleUrls: ['./pub-text-page.component.scss']
})
export class PubTextPageComponent implements OnInit {

  publicationLight: PublicationLight;
  authorLight:AuthorLight;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute // it gives me the current route (URL)
  ) {}


  ngOnInit() {

    this.route.paramMap.subscribe(
      params => {
        this.dataService
          .getPublicationLight(decodeURIComponent(params.get('iri'))) // step 1, 2 and 3
          .subscribe(
            (publicationLight: PublicationLight) => {
              this.publicationLight = publicationLight; // step 4    I give to the attribute person the value of person

                // asynchrone
                this.dataService
                .getAuthorLight(publicationLight.authorValue)
                .subscribe(
                  (authorLight: AuthorLight) => {
                  this.authorLight = authorLight;
                  // console.log(authorLight);
                  });

            },
              
            error => console.error(error)
          );
    },
    error => console.error(error)
  );
}
}