import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { UiService } from './services/ui/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  opened: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(public media: MediaObserver, public uiService: UiService) {}
  ngOnInit(): void {
    this.subscriptions.push(
      this.media.asObservable().subscribe({
        next: (mediaValue) => {
          if (mediaValue[0].mqAlias === 'xs') {
            this.opened = false;
          } else {
            this.opened = true;
          }
        },
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
