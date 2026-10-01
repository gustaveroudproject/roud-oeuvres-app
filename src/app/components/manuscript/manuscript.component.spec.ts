import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { ManuscriptComponent } from './manuscript.component';
import { DataService } from '../../services/data.service';
import { HtmlSanitizerPipe } from '../../pipes/html-sanitizer.pipe';
import { EncodeURIComponentPipe } from '../../pipes/encode-uri-component.pipe';

describe('Manuscript loading display', () => {
  let response: Subject<any>;
  let fixture: ComponentFixture<ManuscriptComponent>;
  const record = { id: 'http://rdfh.ch/0112/test', title: 'Grèce I', archive: 'CLSR GR', shelfmark: 'MS 6 B1/17b' };
  beforeEach(async () => {
    response = new Subject();
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [ManuscriptComponent, HtmlSanitizerPipe, EncodeURIComponentPipe],
      providers: [{ provide: DataService, useValue: { getMsLight: () => response } }]
    }).compileComponents();
    fixture = TestBed.createComponent(ManuscriptComponent);
    fixture.componentInstance.msIRI = record.id;
    fixture.detectChanges();
  });
  it('shows a loading label and no premature link until the delayed response arrives', () => {
    expect(fixture.nativeElement.textContent).toContain('Chargement du manuscrit');
    expect(fixture.nativeElement.textContent).not.toContain('null');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
    response.next(record); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Grèce I');
    expect(fixture.nativeElement.textContent).toContain('MS 6 B1/17b');
    expect(fixture.nativeElement.textContent).not.toContain('Chargement');
    // Router serialization encodes the already encoded IRI segment, as in the deployed template.
    const href = fixture.nativeElement.querySelector('a').getAttribute('href');
    expect(decodeURIComponent(decodeURIComponent(href.substring('/resources/'.length)))).toBe(record.id);
  });
  it('replaces loading with a readable error on request failure', () => {
    response.error(new Error('network failure')); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Impossible de charger');
    expect(fixture.nativeElement.textContent).not.toContain('Chargement');
    expect(fixture.nativeElement.querySelector('a')).toBeNull();
  });
  it('does not show null values or empty reference parentheses for missing metadata', () => {
    response.next({ ...record, title: null, archive: null, shelfmark: null }); fixture.detectChanges();
    expect(fixture.nativeElement.textContent.trim()).toBe('Sans titre');
  });
  it('handles a completed response without any record', () => {
    response.complete(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Impossible de charger');
  });
  it('unsubscribes when the result row is destroyed', () => {
    fixture.destroy(); expect(response.observers.length).toBe(0);
  });
});
