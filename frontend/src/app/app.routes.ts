import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import {ContactComponent} from './pages/contact/contact.component';
import {RdvComponent} from './pages/rdv/rdv.component';
import { FormationComponent } from './pages/formation/formation.component';
import { SanteComponent } from './pages/sante/sante.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component'; 
import { FormationDetailComponent } from './pages/formation-detail/formation-detail.component';
import { RdvFormComponent } from './formulaire/rdv-form/rdv-form.component';
import { FormationFormComponent } from './formulaire/formation-form/formation-form.component';
import { ArticleFormComponent } from './formulaire/article-form/article-form.component';
import { LoginComponent } from './auth/login/login.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { MycoursComponent } from './auth/mycours/mycours.component';
import { AnnuaireComponent } from './pages/annuaire/annuaire.component';
import { VideosPodcastsComponent } from './pages/videos-podcasts/videos-podcasts.component';

export const routes: Routes = [
  //page
  { path: '', component: AccueilComponent }, 
  { path: 'contact', component: ContactComponent },
  { path: 'rdv', component: RdvComponent },
  { path: 'formation', component: FormationComponent },
  { path: 'sante', component: SanteComponent },
  { path: 'article', component: BlogComponent },
  { path: 'article/:id', component: ArticleDetailComponent }, 
  { path: 'formation/:id', component: FormationDetailComponent }, 
  { path: 'annuaire', component: AnnuaireComponent }, 
  { path: 'VideosPodcasts', component: VideosPodcastsComponent }, 

  //admin
  { path: 'creeRdv', component: RdvFormComponent }, 
  { path: 'creeFormation', component: FormationFormComponent }, 
  { path: 'creeArticle', component: ArticleFormComponent }, 

  //auth
  { path: 'login', component: LoginComponent }, 
  { path: 'signin', component: SignInComponent }, 
  { path: 'mycours', component: MycoursComponent }, 

];
