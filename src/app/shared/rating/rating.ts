import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  imports: [CommonModule],
  templateUrl: './rating.html',
  styleUrl: './rating.scss',
})
export class Rating {
  @Input() value = 0;     
  @Input() max = 5;         
  @Input() readonly = true; 
  @Output() valueChange = new EventEmitter<number>();

  stars: number[] = [];

  ngOnChanges() {
    this.stars = Array.from({ length: this.max }, (_, i) => i + 1);
  }

  rate(star: number) {
    if (!this.readonly) {
      this.value = star;
      this.valueChange.emit(this.value);
    }
  }

}
