import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import ChangePasswordComponent from "../change-password/change-password.component";

@Component({
  selector: 'app-new-password',
  imports: [ChangePasswordComponent],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewPasswordComponent implements OnInit {

  ngOnInit(): void { }

}
