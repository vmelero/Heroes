import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/heroe.interface';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({providedIn: 'root'})
export class HeroesService {

    private baseUrl: string = environment.baseUrl;

    constructor(private http: HttpClient) { }

    getHeroes() :Observable<Hero[]>{
        return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
    }

    getHeroeByID(id:string): Observable<Hero|undefined>{
        return this.http.get<Hero>(`${this.baseUrl}/heroes/${id}`)
            .pipe(
                catchError(error => of(undefined)) // si aparece un error porque devuelve undefined devuelve un observable undefined.
            )
    }

    getSuggestions(query: string): Observable<Hero[]> {
        return this.http.get<Hero[]>(`${this.baseUrl}/heroes?q=${query}&_limit=6`);
    }

    addHero(hero: Hero): Observable<Hero>{
        return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
    }

    updateHero(hero: Hero): Observable<Hero>{
        if(!hero.id) throw Error ('Hero id is required');
        return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
    }

    deleteHeroById(id: string): Observable<boolean>{
        return this.http.delete(`${this.baseUrl}/heroes/${id}`)
            .pipe(
                map(resp=> true),
                catchError(err=> of(false))
            );
    }
    
}