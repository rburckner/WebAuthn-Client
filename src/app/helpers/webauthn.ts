import {
  IPublicKeyCredentialAttestation,
  IPublicKeyCredentialAttestationAsStrings,
  IPublicKeyCredentialCreationOptions,
  IPublicKeyCredentialRequestOptionsAsStrings,
  IPublicKeyCredentialAssertion,
  IPublicKeyCredentialAssertionAsStrings,
} from '../interfaces/webauthn.interface';
import { ArrayBufferToBase64, Base64ToArrayBuffer } from './base64';

export function transformPublicKeyCredentialCreationOptionsStringsToBuffers(
  opts: IPublicKeyCredentialCreationOptions
): PublicKeyCredentialCreationOptions {
  return {
    ...opts,
    challenge: Base64ToArrayBuffer(opts.challenge),
    excludeCredentials: opts.excludeCredentials?.map((credential) => {
      return {
        ...credential,
        id: Base64ToArrayBuffer(credential.id),
      };
    }),
    user: { ...opts.user, id: Base64ToArrayBuffer(opts.user.id) },
  };
}
export function tranformPublicKeyCredentialAssertionBuffersToBase64(
  credential: IPublicKeyCredentialAssertion
): IPublicKeyCredentialAssertionAsStrings {
  const result: IPublicKeyCredentialAssertionAsStrings = {
    ...credential,
    authenticatorAttachment: credential.authenticatorAttachment,
    id: credential.id,
    rawId: ArrayBufferToBase64(credential.rawId),
    response: {
      ...credential.response,
      authenticatorData: ArrayBufferToBase64(
        credential.response.authenticatorData
      ),
      clientDataJSON: ArrayBufferToBase64(credential.response.clientDataJSON),
      signature: ArrayBufferToBase64(credential.response.signature),
      userHandle: credential.response.userHandle
        ? ArrayBufferToBase64(credential.response.userHandle)
        : undefined,
    },
    type: credential.type,
  };
  return result;
}

export function tranformPublicKeyCredentialAttestationBuffersToBase64(
  credential: IPublicKeyCredentialAttestation
): IPublicKeyCredentialAttestationAsStrings {
  const result: IPublicKeyCredentialAttestationAsStrings = {
    ...credential,
    authenticatorAttachment: credential.authenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults(),
    id: credential.id,
    rawId: ArrayBufferToBase64(credential.rawId),
    response: {
      ...credential.response,
      attestationObject: ArrayBufferToBase64(
        credential.response.attestationObject
      ),
      authenticatorData: ArrayBufferToBase64(
        credential.response.getAuthenticatorData()
      ),
      clientDataJSON: ArrayBufferToBase64(credential.response.clientDataJSON),
      publicKey: ArrayBufferToBase64(credential.response.getPublicKey()),
      publicKeyAlgorithm: credential.response.getPublicKeyAlgorithm(),
      transports: credential.response.getTransports(),
    },
    type: credential.type,
  };
  return result;
}

export function transformPublicKeyCredentialRequestOptionsStringsToBuffers(
  opts: IPublicKeyCredentialRequestOptionsAsStrings
): PublicKeyCredentialRequestOptions {
  const allowCredentials = opts.allowCredentials.map((credential) => {
    return {
      ...credential,
      id: Base64ToArrayBuffer(credential.id),
    };
  });
  return {
    ...opts,
    challenge: Base64ToArrayBuffer(opts.challenge),
    allowCredentials,
  };
}
