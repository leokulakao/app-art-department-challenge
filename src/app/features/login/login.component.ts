import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="page">
      <main class="login-container">
        <div class="field">
          <input
            class="field__input"
            type="text"
            placeholder="Escribe tu nombre" />
          <button class="field__button button" (click)="onSubmit()">
            Entrar
          </button>
        </div>
      </main>
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
