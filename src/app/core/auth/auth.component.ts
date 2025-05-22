import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterModule],
  template:`
    <router-outlet/>
  `,
  styles:``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AuthComponent { }
