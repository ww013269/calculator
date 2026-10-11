import { Component, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-number-pad',
  styleUrl: './number-pad.css',
  templateUrl: './number-pad.html',
})
export class NumberPad {
  protected numbers = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];

  readonly digitPressed = output<string>();

  // readonly name = input('');
  // 預設值是空字串
}
