import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Alerts } from '../../shared/utils/alerts.util';
@Component({
  selector: 'app-toast',
  template: '',
  styles: ['']
})
export class ToastComponent implements OnChanges {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Input() duration: number = 1500;
  @Input() position: 'top' | 'middle' | 'bottom' = 'top';
  @Input() mode: 'normal' | 'success' | 'warning' = 'warning';

  ngOnChanges(changes: SimpleChanges) {
    if (this.show) {
      Alerts.showToast(this.message, this.duration, this.position, this.mode);
    }
  }
}
