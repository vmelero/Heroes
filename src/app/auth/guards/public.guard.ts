import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, UrlTree, RouterStateSnapshot, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable({providedIn: 'root'})
export class PublicGuard implements CanMatch, CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    private checkAuthStatus(): boolean | Observable<boolean> {
        return this.authService.checkAutentication()
                .pipe(
                    tap(isAuthenticated => {
                        if(isAuthenticated){
                            this.router.navigate(['./']);
                        }
                    }),
                    map(isAuthenticated => !isAuthenticated)
                )
    }

    canMatch(route: Route, segments: UrlSegment[]): Observable<boolean> | boolean {
      //  throw new Error('Method not implemented.');
      return this.checkAuthStatus();
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        //throw new Error('Method not implemented.');
        return true;
    }
    
}