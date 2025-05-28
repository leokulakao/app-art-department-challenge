import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AuthService } from '../../common/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="page">
      <main class="login-container">
        <h1>Art Department Challenge</h1>
        <form action="" class="field" (submit)="onSubmit($event)">
          <input
            class="field__input"
            type="text"
            placeholder="Escribe tu nombre" />
          <button type="submit" class="field__button button">Entrar</button>
        </form>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  protected onSubmit(event: Event | null): void {
    event?.preventDefault();
    console.log('Login submitted');
    void this.authService.login();
  }
}
