import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RomLauncherComponent } from './rom-launcher.component';

describe('RomLauncherComponent', () => {
  let component: RomLauncherComponent;
  let fixture: ComponentFixture<RomLauncherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RomLauncherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RomLauncherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.roms = [{ url: '/test', name: 'Test'}];
    expect(component).toBeTruthy();
    expect(component.roms[0].url).toBe('/test');
  });
});
