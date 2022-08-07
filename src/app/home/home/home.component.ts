import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
  IAuthenticationRequestSubmit,
  IDisplayName,
  IRegistrationRequestSubmit,
} from 'src/app/interfaces/authentication.interface';
import {
  IPublicKeyCredentialAssertion,
  IPublicKeyCredentialAttestation,
} from 'src/app/interfaces/webauthn.interface';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { UiService } from 'src/app/services/ui/ui.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  authError = '';
  regError = '';
  private displayName = '';
  displayNameMinLength = 4;
  authenticationForm = new FormGroup({
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(this.displayNameMinLength),
    ]),
    id: new FormControl(self.crypto.randomUUID(), Validators.required),
  });
  registrationForm = new FormGroup({
    displayName: new FormControl('', [
      Validators.required,
      Validators.minLength(this.displayNameMinLength),
    ]),
    id: new FormControl(self.crypto.randomUUID(), Validators.required),
  });
  subscriptions: Subscription[] = [];

  constructor(
    public media: MediaObserver,
    protected authService: AuthenticationService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  startAuthentication(submitForm: FormGroup) {
    const request: IAuthenticationRequestSubmit = submitForm.value;
    this.displayName = request.displayName;
    this.subscriptions.push(
      this.authService.doAuthenticationRequest(request).subscribe({
        next: (publicKey) => {
          navigator.credentials
            .get({ publicKey })
            .then((credential) => {
              return credential as IPublicKeyCredentialAssertion;
            })
            .then((credential) => {
              this.subscriptions.push(
                this.authService
                  .doAuthenticationAssertion(this.displayName, credential)
                  .subscribe({
                    next: () => {
                      this.uiService.showToast('success');
                    },
                    error: (error) => this.uiService.showToast(error.message),
                  })
              );
            })
            .catch((error) => (this.authError = error.message))
            .finally(() => (this.displayName = ''));
        },
        error: (error) => {
          this.authError = error.message;
          this.uiService.showToast(error.message);
        },
      })
    );
  }

  private createCredential(
    publicKey: PublicKeyCredentialCreationOptions
  ): void {
    navigator.credentials
      .create({ publicKey })
      .then((credential) => {
        return credential as IPublicKeyCredentialAttestation;
      })
      .then((credential) => {
        this.subscriptions.push(
          this.authService
            .doRegisterAttestation(this.displayName, credential)
            .subscribe({
              next: () => {
                this.uiService.showToast('success');
              },
              error: (error) => this.uiService.showToast(error.message),
            })
        );
      })
      .catch((error) => (this.regError = error.message))
      .finally(() => (this.displayName = ''));
  }

  startRegistration(submitForm: FormGroup) {
    const request: IRegistrationRequestSubmit = submitForm.value;
    this.displayName = request.displayName;
    request.name = request.name || request.displayName?.split(' ')[0];
    this.subscriptions.push(
      this.authService.doRegisterRequest(request).subscribe({
        next: (publicKeyOpts) => {
          this.createCredential(publicKeyOpts);
        },
        error: (error) => {
          this.regError = error.message;
          this.uiService.showToast(error.message);
        },
      })
    );
  }
}
