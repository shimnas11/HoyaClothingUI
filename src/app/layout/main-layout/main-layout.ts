import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SideNavComponent } from '../side-nav/side-nav';
import { ProductService } from '../../services/product-service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Authservice } from '../../auth/service/authservice';
@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    SideNavComponent,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = false;
  private productStore = inject(ProductService);
  private authService = inject(Authservice);

  constructor(private observer: BreakpointObserver) {
    this.observer.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }


  ngOnInit() {
    this.productStore.loadProducts();
  }

  toggleSidebar() {
    this.sidenav.toggle();
  }

  logout() {
    this.authService.logout();
  }
}
