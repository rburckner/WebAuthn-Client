import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

import { UiService } from 'src/app/services/ui/ui.service';
import { IPublicKeyCredentialAssertion } from 'src/app/interfaces/webauthn/publicKeyCredentialAssertion.interface';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
    public media: MediaObserver,
    protected authService: AuthenticationService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    // browser.pkcs11
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  assertAuthentication(publicKey: PublicKeyCredentialRequestOptions): void {
    navigator.credentials
      .get({ publicKey })
      .then((credential) => {
        return credential as IPublicKeyCredentialAssertion;
      })
      .then((credential) => {
        this.subscriptions.push(
          this.authService.doAuthenticationAssertion(credential).subscribe({
            next: () => {
              this.uiService.showToast('success');
            },
            error: (error) => this.uiService.showToast(error.message),
          })
        );
      })
      .catch((error) => this.uiService.showToast(error.message));
  }

  startAuthentication(): void {
    this.subscriptions.push(
      this.authService.doAuthenticationRequest().subscribe({
        next: (publicKey) => {
          this.assertAuthentication(publicKey);
        },
        error: (error) => {
          this.uiService.showToast(error.message);
        },
      })
    );
  }

  private attestCredential(
    publicKey: PublicKeyCredentialCreationOptions
  ): void {
    navigator.credentials
      .create({ publicKey })
      .then((credential) => {
        if (credential) {
          this.subscriptions.push(
            this.authService.doRegisterAttestation(credential).subscribe({
              next: () => {
                this.uiService.showToast('success');
              },
              error: (error) => {
                this.uiService.showToast(error.message);
              },
            })
          );
        }
      })
      .catch((error) => {
        this.uiService.showToast(error.message);
      });
  }

  startRegistration(): void {
    this.subscriptions.push(
      this.authService.doRegisterRequest().subscribe({
        next: (registerRequestResponse) => {
          this.attestCredential(
            registerRequestResponse.publicKey as PublicKeyCredentialCreationOptions
          );
        },
        error: (error) => {
          this.uiService.showToast(error.message);
        },
      })
    );
  }
}
