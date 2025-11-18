import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRole } from '../../models/enums';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  readonly userRoles = Object.values(UserRole);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  onLogin(role: UserRole): void {
    this.authService.login(role);
    this.router.navigate(['/tickets']);
  }
}
