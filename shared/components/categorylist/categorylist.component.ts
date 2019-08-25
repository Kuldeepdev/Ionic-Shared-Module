import { Component, OnInit, Input } from '@angular/core';
import { Category } from '../../../modals/category';
@Component({
  selector: 'categorylist',
  templateUrl: './categorylist.component.html',
  styleUrls: ['./categorylist.component.scss'],
})
export class CategorylistComponent implements OnInit {
  @Input() category: Category;
  constructor() { }

  ngOnInit() {}

}
