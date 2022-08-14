import { IAuthenticatorAssertionResponse } from '../interfaces/webauthn/authenticatorAssertion.interface';
import { IAuthenticatorAttestationResponse } from '../interfaces/webauthn/authenticatorAttestation.interface';
import {
  IPublicKeyCredentialAssertion,
  IPublicKeyCredentialAssertionAsStrings,
} from '../interfaces/webauthn/publicKeyCredentialAssertion.interface';
import { IPublicKeyCredentialAttestationAsStrings } from '../interfaces/webauthn/publicKeyCredentialAttestation.interface';
import {
  IPublicKeyCredentialCreationOptions,
  IPublicKeyCredentialRequestOptions,
} from '../interfaces/webauthn/publicKeyCredentialCreation.interface';
import { ArrayBufferToBase64Url, Base64UrlToArrayBuffer } from './base64';

export function pkCredAssertionBuffersToBase64Url(
  credential: IPublicKeyCredentialAssertion
): IPublicKeyCredentialAssertionAsStrings {
  const response = credential.response as IAuthenticatorAssertionResponse;
  const result: IPublicKeyCredentialAssertionAsStrings = {
    ...credential,
    authenticatorAttachment: credential.authenticatorAttachment,
    id: credential.id,
    response: {
      authenticatorData: ArrayBufferToBase64Url(response.authenticatorData),
      clientDataJSON: ArrayBufferToBase64Url(
        credential.response.clientDataJSON
      ),
      publicKey: response.getPublicKey
        ? ArrayBufferToBase64Url(response.getPublicKey())
        : undefined,
      publicKeyAlgorithm: response.getPublicKeyAlgorithm
        ? response.getPublicKeyAlgorithm()
        : undefined,
      signature: ArrayBufferToBase64Url(credential.response.signature),
      transports: response.getTransports ? response.getTransports() : undefined,
      userHandle: response.userHandle
        ? ArrayBufferToBase64Url(response.userHandle)
        : undefined,
    },
    type: credential.type,
  };
  return result;
}

export function pkCredAttestationBuffersToBase64Url(
  credential: PublicKeyCredential
): IPublicKeyCredentialAttestationAsStrings {
  const response = credential.response as IAuthenticatorAttestationResponse;
  const { attestationObject, clientDataJSON } = response;
  const clientExtensionResults = credential.getClientExtensionResults();
  const result: IPublicKeyCredentialAttestationAsStrings = {
    ...credential,
    clientExtensionResults: Object.keys(clientExtensionResults).length
      ? clientExtensionResults
      : undefined,
    id: credential.id,
    response: {
      attestationObject: ArrayBufferToBase64Url(attestationObject),
      clientDataJSON: ArrayBufferToBase64Url(clientDataJSON),

      authenticatorData: response.getAuthenticatorData
        ? ArrayBufferToBase64Url(response.getAuthenticatorData())
        : undefined,
      publicKey: response.getPublicKey
        ? ArrayBufferToBase64Url(response.getPublicKey())
        : undefined,
      publicKeyAlgorithm: response.getPublicKeyAlgorithm
        ? response.getPublicKeyAlgorithm()
        : undefined,
      transports: response.getTransports ? response.getTransports() : [],
    },
    type: credential.type,
  };
  return result;
}

export function pkCredCreationOptsStringsToBuffers(
  opts: IPublicKeyCredentialCreationOptions
): PublicKeyCredentialCreationOptions {
  return {
    ...opts,
    challenge: Base64UrlToArrayBuffer(opts.challenge),
    excludeCredentials: opts.excludeCredentials?.map((credential) => {
      return {
        ...credential,
        id: Base64UrlToArrayBuffer(credential.id),
      };
    }),
    user: { ...opts.user, id: Base64UrlToArrayBuffer(opts.user.id) },
  };
}

export function pkCredReqOptsStringsToBuffers(
  opts: IPublicKeyCredentialRequestOptions
): PublicKeyCredentialRequestOptions {
  const allowCredentials = opts.allowCredentials.map((credential) => {
    return {
      ...credential,
      id: Base64UrlToArrayBuffer(credential.id),
    };
  });
  return {
    ...opts,
    challenge: Base64UrlToArrayBuffer(opts.challenge),
    allowCredentials,
  };
}
