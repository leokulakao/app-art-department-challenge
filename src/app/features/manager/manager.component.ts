import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-manager',
  template: `
    <h1>Manager</h1>
    <p>Welcome to the Manager component!</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagerComponent {}
