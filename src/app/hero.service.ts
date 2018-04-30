import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of"
import { map, tap, catchError } from "rxjs/operators"
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from "./hero";
import { MessagesService } from "./messages.service";

@Injectable()
export class HeroService {
  private heroesUrl = "api/heroes";
  private httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) {}

  getHeroes(): Observable<Hero[]> {
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log("fetched heroes")),
        catchError(this.handleError("getHeroes", []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http
      .get<Hero>(url)
      .pipe(
        tap(_ => this.log("fetched hero id=" + id)),
        catchError(this.handleError<Hero>("getHero"))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) return of([]);

    const url = `${this.heroesUrl}/?name=${term}`;
    return this.http
      .get<Hero[]>(url)
      .pipe(
        tap(heroes => this.log("Fetched heroes with term: " + term)),
        catchError(this.handleError<Hero[]>("searchHeroes"))
      );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http
      .post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((hero: Hero) => this.log("New hero added with id" + hero.id)),
        catchError(this.handleError<Hero>("addHero"))
      );
  }

  deleteHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http
      .delete(url)
      .pipe(
        tap(_ => this.log("Deleted hero with id: " + id)),
        catchError(this.handleError<any>("deleteHero"))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http
      .put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log("Updated hero with id" + hero.id)),
        catchError(this.handleError<any>("update Hero"))
      );
  }

  private log(message: string) {
    this.messagesService.add("HeroService: " + message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}

