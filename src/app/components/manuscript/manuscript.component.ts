import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MsLight } from 'src/app/models/manuscript.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'or-manuscript',
  templateUrl: './manuscript.component.html',
  styleUrls: ['./manuscript.component.scss']
})
export class ManuscriptComponent implements OnInit, OnDestroy {
  msLight: MsLight;
  loading = true;
  loadFailed = false;
  private request: Subscription;

  @Input() msIRI: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.request = this.dataService.getMsLight(this.msIRI).subscribe({
      next: (msLight: MsLight) => {
        this.msLight = msLight;
        this.loading = false;
        this.loadFailed = !msLight;
      },
      error: () => {
        this.loading = false;
        this.loadFailed = true;
      },
      complete: () => {
        this.loading = false;
        this.loadFailed = !this.msLight;
      }
    });
  }

  ngOnDestroy() {
    this.request?.unsubscribe();
  }
}
