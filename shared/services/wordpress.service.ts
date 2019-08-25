import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class WordpressService {

  constructor(private http: HttpClient) { }

  getPost(id = 0, categories = '', search = '', page = 1): Observable<any> {
    let query = '';
    if (id !== 0) {
      query += '/' + id;
    } else {
      query += '?per_page=' + environment.per_page + '&page=' + page;
      if (categories !== '') {
        query += '&categories=' + categories;
      } else {
        query += '&categories=' + environment.appCategoryId;
      }
      if (search !== '') {
        query += '&search=' + search;
      }
    }
    return this.http.get(environment.APIBASEURL + `posts` + query).pipe(
      map(results => results)
    );
  }

  getImage(id): Observable<any> {
    return this.http.get(environment.APIBASEURL + `media/` + id).pipe(
      map(results => results)
    );
  }

  getCategories(id = 0, parent = 0) {
    let query = '?orderby=count&order=desc';
    if (id !== 0) {
      query += '/' + id;
    } else {
      if (parent !== 0) {
        query += '&parent=' + parent;
      } else {
        query += '&parent=' + environment.appCategoryId;
      }
    }
    return this.http.get(environment.APIBASEURL + `categories` + query).pipe(
      map(results => results)
    );
  }

  getCategoriesURL(id = 0, parent = 0): Promise<string> {
    return new Promise((resolve, reject) => {
      let query = '?orderby=count&order=desc';
      if (id !== 0) {
        query += '/' + id;
      } else {
        if (parent !== 0) {
         query += '&parent=' + parent;
        } else {
          query += '&parent=' + environment.appCategoryId;
        }
      }
      resolve( `categories` + query);
    });
  }
}
