import {Component} from '@angular/core';
import {LoadingBarService} from "@ngx-loading-bar/core";

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar-custom.component.html',
  styleUrls: ['./loading-bar-custom.component.scss']
})
export class LoadingBarCustomComponent {
  constructor(public loader: LoadingBarService) {
  }
}
