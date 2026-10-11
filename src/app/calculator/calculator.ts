import { Component, signal } from '@angular/core';

import { Display } from '../display/display';
import { NumberPad } from '../number-pad/number-pad';
import { OperatorPad } from '../operator-pad/operator-pad';

@Component({
  imports: [Display, NumberPad, OperatorPad],
  selector: 'app-calculator',
  styleUrl: './calculator.css',
  templateUrl: './calculator.html',
})
export class Calculator {
  protected formula = signal('');

  protected onDigitPressed(pickUpNumber: string): void {
    this.formula.update((old) => old + pickUpNumber);
    //this.formula.set(this.formula() + pickUpNumber);
    console.log('子元件被按了：' + pickUpNumber);
    console.log('算式數字現在為:' + this.formula());
  }
}
