import { Injectable } from '@angular/core';
import { ActivatedRoute,ActivatedRouteSnapshot,RouterStateSnapshot,Router,UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth_service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

constructor(private authService: AuthService,private router: Router){}

  canActivate(route: ActivatedRouteSnapshot,state:RouterStateSnapshot): Observable<boolean | UrlTree> |Promise<boolean> | boolean |UrlTree {
    if (this.authService.isAuth){
      return true;
    }
    
    this.router.navigate(['connexion'])
    return false;
  }

}
