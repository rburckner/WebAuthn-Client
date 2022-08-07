import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap, async } from 'rxjs';
import {
  IAuthenticationResponse,
  IDisplayName,
  IRegistrationRequestSubmit,
} from '../../interfaces/authentication.interface';
import {
  IPublicKeyCredentialAssertion,
  IPublicKeyCredentialAttestation,
  IPublicKeyCredentialCreationOptions,
  IPublicKeyCredentialRequestOptionsAsStrings,
} from '../../interfaces/webauthn.interface';
import {
  tranformPublicKeyCredentialAssertionBuffersToBase64,
  tranformPublicKeyCredentialAttestationBuffersToBase64,
  transformPublicKeyCredentialCreationOptionsStringsToBuffers,
  transformPublicKeyCredentialRequestOptionsStringsToBuffers,
} from '../../helpers/webauthn';
import { URLs } from './authentication.static';
import { transformError } from 'src/app/helpers/transformError';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public readonly hasCredentialsInNavigator: boolean =
    'credentials' in navigator;
  constructor(private http: HttpClient) {}

  doAuthenticationAssertion(
    displayName: string,
    credential: IPublicKeyCredentialAssertion
  ): Observable<void> {
    return this.http
      .post<IAuthenticationResponse>(URLs.v1.webauthnAuthenticateAssert, {
        displayName,
        credential:
          tranformPublicKeyCredentialAssertionBuffersToBase64(credential),
      })
      .pipe(
        map((result) => {
          // save to some observable
          return;
        }),
        catchError(transformError)
      );
  }

  doAuthenticationRequest(
    displayName: IDisplayName
  ): Observable<PublicKeyCredentialRequestOptions> {
    return this.http
      .post<IPublicKeyCredentialRequestOptionsAsStrings>(
        URLs.v1.webauthnAuthenticateRequest,
        displayName
      )
      .pipe(
        map(transformPublicKeyCredentialRequestOptionsStringsToBuffers),
        catchError(transformError)
      );
  }

  doRegisterAttestation(
    displayName: string,
    credential: IPublicKeyCredentialAttestation
  ): Observable<void> {
    return this.http
      .post<IAuthenticationResponse>(URLs.v1.webauthnRegisterAttest, {
        displayName,
        credential:
          tranformPublicKeyCredentialAttestationBuffersToBase64(credential),
      })
      .pipe(
        tap(() => {
          if (credential.type !== 'public-key') {
            navigator.credentials.store(credential);
          }
        }),
        map((result) => {
          // save to some observable
          return;
        }),
        catchError(transformError)
      );
  }

  doRegisterRequest(
    request: IRegistrationRequestSubmit
  ): Observable<PublicKeyCredentialCreationOptions> {
    return this.http
      .post<IPublicKeyCredentialCreationOptions>(
        URLs.v1.webauthnRegisterRequest,
        request
      )
      .pipe(
        map(transformPublicKeyCredentialCreationOptionsStringsToBuffers),
        catchError(transformError)
      );
  }
}
