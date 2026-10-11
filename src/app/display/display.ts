import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-display',
  styleUrl: './display.css',
  templateUrl: './display.html',
})
export class Display {
  readonly displayFormula = input('');
}
