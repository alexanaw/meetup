import {Injectable} from "@angular/core";
import { Observable } from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Item} from "./item";

@Injectable()
export class WishService {

  constructor(private http: HttpClient) {}

  getWishItem(id: number, login:string): Observable<any> {
    let headers = new HttpHeaders()
      .set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);

    return this.http.get<any>(`api/item/${id}/login/${login}`, {headers: headers});
  }

  addWishItem(item: Item): Observable<any> {
    let headers = new HttpHeaders()
      .set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);

    return this.http.post('api/item/', item, {headers: headers});
  }

  addExistWishItem(item: Item): Observable<any> {
    let headers = new HttpHeaders()
      .set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);

    return this.http.post(`api/item/${item.itemId}`, item, {headers: headers});
  }

  editWishItem(item: Item): Observable<any>{
    let headers = new HttpHeaders()
      .set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);

    return this.http.put('api/item/', item, {headers: headers});
  }

  deleteWishItem(item: Item): Observable<any> {
    let headers = new HttpHeaders()
      .set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);

    return this.http.delete(`api/item/${item.itemId}`, {headers: headers});
  }

  bookWishItem(item: Item): Observable<any> {
    let headers = new HttpHeaders()
      .set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);

    let url = `/api/item/${item.itemId}/owner/${item.ownerId}/booker/${item.bookerId}`;

    return this.http.post(url, item, {headers: headers});
  }

  unbookWishItem(item: Item): Observable<any> {
    let headers = new HttpHeaders()
      .set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);

    let url = `/api/item/${item.itemId}/owner/${item.ownerId}/booker/${item.bookerId}`;

    return this.http.delete(url, {headers: headers});
  }

  addLike(id:number){
    let headers = new HttpHeaders().set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);
    let url = `api/item/${id}/like`;
    return this.http.post(url, {},{headers: headers})
  }

  removeLike(id: number){
    let headers = new HttpHeaders().set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);
    let url = `api/item/${id}/like`;
    return this.http.delete(url,{headers: headers})
  }

  getLoginsWhoLiked(id: number){
    let headers = new HttpHeaders().set("Authorization", `Bearer ${JSON.parse(localStorage.currentUser).token}`);
    let url = `api/item/${id}/likes`;
    return this.http.get(url,{headers: headers})
  }
}
