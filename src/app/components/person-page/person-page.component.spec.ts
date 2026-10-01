import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NEVER } from 'rxjs';
import { PersonPageComponent } from './person-page.component';
import { DataService } from '../../services/data.service';
import { HtmlSanitizerPipe } from '../../pipes/html-sanitizer.pipe';

@Pipe({name: 'knoradatesFormatting'})
class DatePipeStub implements PipeTransform { transform(value: string) { return value; } }
@Pipe({name: 'encodeURIComponent'})
class EncodePipeStub implements PipeTransform { transform(value: string) { return encodeURIComponent(value || ''); } }
@Pipe({name: 'removeTextAndPar'})
class TextPipeStub implements PipeTransform { transform(value: string) { return value; } }

describe('PersonPageComponent biography', () => {
  let fixture: ComponentFixture<PersonPageComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [PersonPageComponent, HtmlSanitizerPipe, DatePipeStub, EncodePipeStub, TextPipeStub],
      providers: [
        {provide: DataService, useValue: {}},
        {provide: ActivatedRoute, useValue: {paramMap: NEVER}}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(PersonPageComponent);
  });
  function render(notice: string | null | undefined) {
    fixture.componentInstance.person = {
      name: 'Jean', surname: 'Viollier', id: 'http://rdfh.ch/0112/example',
      notice, Viaf: 'https://viaf.org/viaf/123', DhsID: null
    } as any;
    fixture.detectChanges();
  }
  for (const notice of [null, undefined, '', '   \n ']) {
    it(`hides empty biography (${JSON.stringify(notice)}) and retains VIAF`, () => {
      render(notice);
      expect(fixture.nativeElement.querySelector('.notice')).toBeNull();
      expect(fixture.nativeElement.textContent).not.toContain('null');
      expect(fixture.nativeElement.querySelector('a[href="https://viaf.org/viaf/123"] img')).not.toBeNull();
    });
  }
  it('preserves biography HTML and links when content arrives', () => {
    render(null);
    render('<p>Paysan, né à <a href="https://example.org/place">Sarandin</a>.</p>');
    const notice = fixture.nativeElement.querySelector('.notice');
    expect(notice.textContent).toContain('Paysan, né à Sarandin.');
    expect(notice.querySelector('a').getAttribute('href')).toBe('https://example.org/place');
    render(null);
    expect(fixture.nativeElement.querySelector('.notice')).toBeNull();
  });
});
