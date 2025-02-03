import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [
  ]
})
export class LoginPageComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin(): void{
    this.authService.login('veronica@gmail.conm','123456')
      .subscribe(user => {
          this.router.navigate(['/']);
      })
  }

  ngOnInit(): void {
  }

}
