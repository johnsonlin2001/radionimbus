import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-details-pane',
  standalone: true,
  imports: [],
  templateUrl: './details-pane.component.html',
  styleUrl: './details-pane.component.css', 
})
export class DetailsPaneComponent {
  @Input() weatherData!: any;

  @Output() close = new EventEmitter<void>();

  closeDetailsPane() {
    this.close.emit();
  }

}
