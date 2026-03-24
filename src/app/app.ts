

import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { LoaderComponent } from './shared/loader-component/loader-component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app2.css'
})
export class App {

}