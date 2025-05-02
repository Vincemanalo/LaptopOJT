// header.component.ts
import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { FeaturesService } from '../../features/features.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { filter, map } from 'rxjs/operators';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  headerTitle = 'Laptop Inventory';
  isMobile = window.innerWidth < 700;
  isSidenavOpen = !this.isMobile;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('sidenavContainer', { read: ElementRef }) sidenavContainer!: ElementRef;

  private autoCloseTimerSub?: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private featuresService: FeaturesService,
  ) {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child?.firstChild) { child = child.firstChild; }
          return child?.snapshot.data['title'] || 'Laptop Inventory';
        })
      )
      .subscribe(title => (this.headerTitle = title));
  }

  @HostListener('window:resize', ['$event'])
  onResize(e: any) {
    this.isMobile = e.target.innerWidth < 700;
    console.log('resize → isMobile=', this.isMobile);
    this.isSidenavOpen = !this.isMobile;
    if (!this.isMobile) this.clearAutoCloseTimer();
  }

  ngAfterViewInit() {
    console.log('HeaderComponent initialized');
  }

  ngOnDestroy() {
    this.clearAutoCloseTimer();
  }

  /** Called from the menu button */
  toggleSidenav() {
    console.log('toggleSidenav() before →', this.isSidenavOpen);
    if (this.isSidenavOpen) {
      this.closeSidenav();
    } else {
      this.openSidenav();
    }
    console.log('toggleSidenav() after →', this.isSidenavOpen);
  }

  /** Called when you click the backdrop (only in 'over' mode) */
  onBackdropClick() {
    console.log('backdropClick');
    this.closeSidenav();
  }

  /** Clicking the content pane also closes on mobile */
  onContentClick() {
    console.log('contentClick');
    if (this.isMobile) {
      this.closeSidenav();
    }
  }

  private openSidenav() {
    console.log('openSidenav');
    this.isSidenavOpen = true;
    this.startAutoCloseTimer();
  }

  private closeSidenav() {
    console.log('closeSidenav');
    this.isSidenavOpen = false;
    this.clearAutoCloseTimer();
  }

  private startAutoCloseTimer() {
    this.clearAutoCloseTimer();
    console.log('startAutoCloseTimer');
    if (this.isMobile) {
      this.autoCloseTimerSub = timer(5000).subscribe(() => {
        console.log('auto-close timer fired');
        this.closeSidenav();
      });
    }
  }

  private clearAutoCloseTimer() {
    if (this.autoCloseTimerSub) {
      console.log('clearAutoCloseTimer');
      this.autoCloseTimerSub.unsubscribe();
      this.autoCloseTimerSub = undefined;
    }
  }

  logout() {
    this.featuresService.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('auth_token');
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error('Logout failed:', err);
        alert('Logout failed');
      },
    });
  }
}
