import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input() current: number = 0;
  @Input() total: number = 10;

  constructor() {
    
  }

}
