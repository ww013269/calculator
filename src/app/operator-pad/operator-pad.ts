import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-operator-pad',
  styleUrl: './operator-pad.css',
  templateUrl: './operator-pad.html',
})
export class OperatorPad {
  protected operatorSymbols = ['+', '-', '*', '/'];
}
