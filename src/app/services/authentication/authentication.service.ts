import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap } from 'rxjs';

import { URLs } from './authentication.static';
import { IAuthenticationResponse } from '../../interfaces/authentication.interface';
import {
  pkCredAssertionBuffersToBase64Url,
  pkCredAttestationBuffersToBase64Url,
  pkCredCreationOptsStringsToBuffers,
  pkCredReqOptsStringsToBuffers,
} from '../../helpers/webauthn';
import { transformError } from 'src/app/helpers/transformError';
import { IPublicKeyCredentialAssertion } from 'src/app/interfaces/webauthn/publicKeyCredentialAssertion.interface';
import {
  IPublicKeyCredentialCreationOptions,
  IPublicKeyCredentialCreationOptionsRequestResponse,
  IPublicKeyCredentialRequestOptions,
} from 'src/app/interfaces/webauthn/publicKeyCredentialCreation.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  userId: string = '';
  public readonly hasCredentialsInNavigator: boolean =
    'credentials' in navigator;
  constructor(private http: HttpClient) {}

  doAuthenticationAssertion(
    credential: IPublicKeyCredentialAssertion
  ): Observable<void> {
    return this.http
      .post<IAuthenticationResponse>(URLs.v1.webauthnAuthenticateAssert, {
        ...pkCredAssertionBuffersToBase64Url(credential),
        userId: this.userId,
      })
      .pipe(
        map((result) => {
          // save to some observable
          return;
        }),
        catchError(transformError)
      );
  }

  doAuthenticationRequest(): Observable<PublicKeyCredentialRequestOptions> {
    return this.http
      .post<IPublicKeyCredentialRequestOptions>(
        URLs.v1.webauthnAuthenticateRequest,
        { userId: this.userId }
      )
      .pipe(map(pkCredReqOptsStringsToBuffers), catchError(transformError));
  }

  doRegisterAttestation(credential: Credential): Observable<void> {
    return this.http
      .post<IAuthenticationResponse>(URLs.v1.webauthnRegisterAttest, {
        ...pkCredAttestationBuffersToBase64Url(
          credential as PublicKeyCredential
        ),
        userId: this.userId,
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

  doRegisterRequest(): Observable<IPublicKeyCredentialCreationOptionsRequestResponse> {
    return this.http
      .get<IPublicKeyCredentialCreationOptionsRequestResponse>(
        URLs.v1.webauthnRegisterRequest
      )
      .pipe(
        map((response) => {
          this.userId = response.userId;
          return {
            ...response,
            publicKey: pkCredCreationOptsStringsToBuffers(
              response.publicKey as IPublicKeyCredentialCreationOptions
            ),
          };
        }),
        catchError(transformError)
      );
  }
}
