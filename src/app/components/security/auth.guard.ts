import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { SharedService } from "src/app/services/shared.service";

@Injectable()
export class AuthGuard implements CanActivate {

  public shared: SharedService;

  constructor(private router: Router) {
    this.shared = SharedService.getInstance();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if(this.shared.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
