import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import {ContactComponent} from './pages/contact/contact.component';
import {RdvComponent} from './pages/rdv/rdv.component';
import { FormationComponent } from './pages/formation/formation.component';
import { SanteComponent } from './pages/sante/sante.component';
import { BlogComponent } from './pages/blog/blog.component';

export const routes: Routes = [
  { path: '', component: AccueilComponent }, 
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'rdv', component: RdvComponent },
  { path: 'formation', component: FormationComponent },
  { path: 'sante', component: SanteComponent },
  { path: 'blog', component: BlogComponent },


];
