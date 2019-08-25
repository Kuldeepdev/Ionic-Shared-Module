import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../../modals/post';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.scss'],
})
export class ItemlistComponent implements OnInit {
  @Input() post: Post;
  @Input() config: number = 1;
  constructor(public router: Router, public ss: SharedService) { }

  ngOnInit() {}

  detailPage(item: Post) {
    this.ss.configInterstitial();
    this.router.navigate(['/itemdetail/' + item.id]);
  }

}
