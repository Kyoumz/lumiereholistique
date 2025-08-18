import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil.component';
import {ContactComponent} from './pages/contact/contact.component';
import {RdvComponent} from './pages/rdv/rdv.component';
import { FormationComponent } from './pages/formation/formation.component';
import { SanteComponent } from './pages/sante/sante.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component'; 
import { FormationDetailComponent } from './pages/formation-detail/formation-detail.component';
import { RdvFormComponent } from './admin/rdv-form/rdv-form.component';
import { FormationFormComponent } from './admin/formation-form/formation-form.component';
import { ArticleFormComponent } from './admin/article-form/article-form.component';
import { LoginComponent } from './auth/login/login.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { MycoursComponent } from './auth/mycours/mycours.component';
import { AnnuaireComponent } from './pages/annuaire/annuaire.component';
import { VideosPodcastsComponent } from './pages/videos-podcasts/videos-podcasts.component';
import { VideoPodcastFormComponent } from './admin/video-podcast-form/video-podcast-form.component';
import { AnnuaireFormComponent } from './admin/annuaire-form/annuaire-form.component';
import { MycoursdetailComponent } from './auth/mycours/mycoursdetail/mycoursdetail.component';
import { PanneladminComponent } from './admin/panneladmin/panneladmin.component';
import { AuthGuard } from '../auth.guard';
import { AdminGuard } from '../admin.guard';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

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
  { path: 'creeRdv', component: RdvFormComponent,canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'creeFormation', component: FormationFormComponent ,canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'creeArticle', component: ArticleFormComponent ,canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'creeAnnuaire', component: AnnuaireFormComponent ,canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'creeVideoPodcast', component: VideoPodcastFormComponent ,canActivate: [AuthGuard, AdminGuard] }, 
  { path: 'admin', component: PanneladminComponent,canActivate: [AdminGuard] }, 

  { path: 'editArticle/:id', component: ArticleFormComponent ,canActivate: [AuthGuard, AdminGuard] },
  { path: 'editRdv/:id', component: RdvFormComponent ,canActivate: [AuthGuard, AdminGuard] },
  { path: 'editFormation/:id', component: FormationFormComponent ,canActivate: [AuthGuard, AdminGuard] },
  { path: 'editAnnuaire/:id', component: AnnuaireFormComponent ,canActivate: [AuthGuard, AdminGuard] },
  { path: 'editVideoPodcast/:id', component: VideoPodcastFormComponent ,canActivate: [AuthGuard, AdminGuard] },

  //auth
  { path: 'login', component: LoginComponent }, 
  { path: 'signin', component: SignInComponent }, 
  { path: 'mycours', component: MycoursComponent, canActivate: [AuthGuard] }, 
  { path: 'mycours/:id', component: MycoursdetailComponent, canActivate: [AuthGuard] }, 
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent }

];
