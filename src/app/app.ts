import { Component, signal } from '@angular/core';

// import { Calculator } from './calculator/calculator';

import { Calculator } from './calculator/calculator';
@Component({
  imports: [Calculator],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('calculator');
}
