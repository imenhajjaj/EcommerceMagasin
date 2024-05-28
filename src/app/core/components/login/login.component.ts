import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormControl,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router:Router) { 
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(
          response => {
            console.log('Réponse du serveur:', response);
            // Redirection vers la page d'accueil après une authentification réussie
            this.router.navigate(['/']);
          },
          error => {
            console.error('Erreur lors de la connexion:', error);
            this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
          }
        );
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
    }
  }
  
}
