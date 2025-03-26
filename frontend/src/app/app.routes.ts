import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import {ContactComponent} from './pages/contact/contact.component'

export const routes: Routes = [
  { path: '', component: AccueilComponent }, 
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },

];
