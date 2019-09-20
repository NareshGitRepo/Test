import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingareaSyncComponent } from './waitingarea-sync.component';

describe('WaitingareaSyncComponent', () => {
  let component: WaitingareaSyncComponent;
  let fixture: ComponentFixture<WaitingareaSyncComponent>;

  
  describe('ReceptionareaComponent', () => {
    let component: WaitingareaSyncComponent;
    let fixture: ComponentFixture<WaitingareaSyncComponent>;
  
    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [ WaitingareaSyncComponent ]
      })
      .compileComponents();
    }));
  
    beforeEach(() => {
      fixture = TestBed.createComponent(WaitingareaSyncComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
  