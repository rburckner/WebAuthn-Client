import {
  IAuthenticatorAttestationResponse,
  IAuthenticatorAttestationResponseAsStrings,
} from './authenticatorAttestation.interface';

export interface IPublicKeyCredentialAttestation
  extends Omit<PublicKeyCredential, 'response'> {
  clientExtensionResults: AuthenticationExtensionsClientOutputs | undefined;
  response: IAuthenticatorAttestationResponse;
}

export interface IPublicKeyCredentialAttestationAsStrings
  extends Omit<IPublicKeyCredentialAttestation, 'response'> {
  response: IAuthenticatorAttestationResponseAsStrings;
}
