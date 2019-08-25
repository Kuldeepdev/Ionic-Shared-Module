import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router'; 
import { Post } from '../../../modals/post';
@Component({
  selector: 'searchlist',
  templateUrl: './searchlist.component.html',
  styleUrls: ['./searchlist.component.scss'],
})
export class SearchlistComponent implements OnInit {
  @Input() post: Post;
  constructor(private router: Router) { }

  ngOnInit() {}
  detailPage(item: Post) {
    //this.admob.configInterstitial();
    this.router.navigate(['/itemdetail/' + item.id]);
  }

}
