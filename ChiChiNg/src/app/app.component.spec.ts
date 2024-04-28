import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { APP_BASE_HREF } from '@angular/common';
import { DebugNode } from '@angular/core';
describe('AppComponent', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      declarations: [
      ],
    }).compileComponents();

  }));

  afterEach(() => {

  });

  afterAll(() => {
  })

  it('should not be muted or paused', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    
    expect(fixture.debugElement.componentInstance.muted).toBe(false);
    expect(fixture.debugElement.componentInstance.paused).toBe(false);

    fixture.debugElement.nativeElement.remove();
    fixture.destroy();
  }));

  it('should have a functional chichiIO', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    
    expect(fixture.debugElement.componentInstance.muted).toBe(false);
    expect(fixture.debugElement.componentInstance.paused).toBe(false);

    fixture.debugElement.nativeElement.remove();
    fixture.destroy();
  }));

});
