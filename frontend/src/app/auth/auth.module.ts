import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../components/login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule],
  exports: [LoginComponent],
})
export class AuthModule {}
