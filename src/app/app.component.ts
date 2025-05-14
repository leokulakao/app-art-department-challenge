import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <h1>Department Challenge</h1>

    <router-outlet></router-outlet>
  `,
  imports: [RouterOutlet],
})
export class AppComponent {
  title = 'app-department-challenge';
}
