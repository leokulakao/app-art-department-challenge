import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="page">
      <header class="header">
        <div class="app-title__block">
          <!-- <h2 class="app-title__item">Login</h2> -->
        </div>
      </header>
      <main class="container">
        <div class="login-container">
          <div class="field">
            <input
              class="field__input"
              type="text"
              placeholder="Escribe su number" />
            <button class="field__button button" (click)="onSubmit()">
              Entrar
            </button>
          </div>
        </div>
      </main>
      <footer class="navigation"></footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  protected onSubmit() {
    void this.authService.login();
  }
}
