import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, tap, mergeMap } from 'rxjs';

import { URLs } from './authentication.static';
import {
  IAuthenticationResponse,
  IRegistrationNonce,
} from '../../interfaces/authentication.interface';
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
  IPublicKeyCredentialRequestOptionsRequestResponse,
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
          console.log(result);
          return;
        }),
        catchError(transformError)
      );
  }

  attestCredential(credential: Credential): Observable<void> {
    return this.http
      .post<IAuthenticationResponse>(URLs.v1.webauthnRegisterAttest, {
        ...pkCredAttestationBuffersToBase64Url(
          credential as PublicKeyCredential
        ),
        userId: this.userId,
      })
      .pipe(
        tap(() => {
          if (credential.type === 'password') {
            navigator.credentials.store(credential);
          }
        }),
        map((result) => {
          // save to some observable
          console.log(result);
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

  startAuthenticationRequest(): Observable<PublicKeyCredentialRequestOptions> {
    return this.http
      .post<IPublicKeyCredentialRequestOptions>(
        URLs.v1.webauthnAuthenticateRequest,
        { userId: this.userId }
      )
      .pipe(map(pkCredReqOptsStringsToBuffers), catchError(transformError));
  }

  startAuthenticationWithNonce(
    nonce: string
  ): Observable<PublicKeyCredentialRequestOptions> {
    return this.http
      .post<IPublicKeyCredentialRequestOptionsRequestResponse>(
        URLs.v1.webauthnAuthenticateRequestFromNonce,
        { nonce }
      )
      .pipe(
        tap(({ userId }) => {
          this.userId = userId;
        }),
        map(({ publicKey }) => {
          return publicKey as IPublicKeyCredentialRequestOptions;
        }),
        map(pkCredReqOptsStringsToBuffers),
        catchError(transformError)
      );
  }

  requestRegistrationNonce(): Observable<IRegistrationNonce> {
    return this.http
      .post<IRegistrationNonce>(URLs.v1.nonceRegistrationRequest, {
        userId: this.userId,
      })
      .pipe(catchError(transformError));
  }
}
