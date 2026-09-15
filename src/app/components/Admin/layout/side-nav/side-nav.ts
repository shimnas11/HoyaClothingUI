import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-side-nav',
  imports: [RouterLink,
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatListModule
  ],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNavComponent {
  isExpanded = false;

  toggleMenu(): void {
    this.isExpanded = !this.isExpanded;
  }
}
