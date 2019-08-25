import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { readPatchedData } from '@angular/core/src/render3/util';
import { repeat } from 'rxjs/operators';

@Component({
  selector: 'itemskeleton',
  templateUrl: './itemskeleton.component.html',
  styleUrls: ['./itemskeleton.component.scss'],
})
export class ItemskeletonComponent implements OnInit, OnChanges {
  @Input() isShow;
  @Input() repeat = 1;
  @Input() dataNotFoundMessage: string = "Data not found, please check latter.";
  loop = [];
  constructor() { }

  ngOnChanges() {
    this.loop = [];
    for (let i = 0; i < this.repeat; i++) {
      this.loop.push(i);
    }
  }
  ngOnInit() {
  }

}
