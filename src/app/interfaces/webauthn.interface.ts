export interface IAuthenticatorAssertionResponse
  extends AuthenticatorAssertionResponse {}
export interface IAuthenticatorAssertionResponseAsStrings
  extends Omit<
    AuthenticatorAssertionResponse,
    'authenticatorData' | 'clientDataJSON' | 'signature' | 'userHandle'
  > {
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
  userHandle?: string | null;
}

export interface IAuthenticatorAttestationResponse
  extends AuthenticatorAttestationResponse {
  getAuthenticatorData(): ArrayBuffer;
  getPublicKey(): ArrayBuffer;
  getPublicKeyAlgorithm(): number;
  getTransports(): string[];
}

interface IAuthenticatorAttestationResponseAsStrings
  extends Omit<
    AuthenticatorAttestationResponse,
    'attestationObject' | 'clientDataJSON'
  > {
  attestationObject: string;
  authenticatorData?: string;
  clientDataJSON: string;
  publicKey?: string;
  publicKeyAlgorithm?: number;
  transports?: string[];
}

interface IPublicKeyCredentialDescriptor
  extends Omit<PublicKeyCredentialDescriptor, 'id'> {
  id: string;
}

interface IPublicKeyCredentialUserEntity
  extends Omit<PublicKeyCredentialUserEntity, 'id'> {
  id: string;
}

export interface IPublicKeyCredentialCreationOptions
  extends Omit<
    PublicKeyCredentialCreationOptions,
    'challenge' | 'excludeCredentials' | 'user'
  > {
  challenge: string;
  excludeCredentials: IPublicKeyCredentialDescriptor[];
  user: IPublicKeyCredentialUserEntity;
}

export interface IPublicKeyCredentialAssertion
  extends Omit<PublicKeyCredential, 'response'> {
  authenticatorAttachment: string;
  clientExtensionResults?: AuthenticationExtensionsClientOutputs;
  // getClientExtensionResults(): AuthenticationExtensionsClientOutputs;
  response: IAuthenticatorAssertionResponse;
}

export interface IPublicKeyCredentialAssertionAsStrings
  extends Omit<IPublicKeyCredentialAssertion, 'response' | 'rawId'> {
  rawId: string;
  response: IAuthenticatorAssertionResponseAsStrings;
}

export interface IPublicKeyCredentialAttestation
  extends Omit<PublicKeyCredential, 'getClientExtensionResults' | 'response'> {
  authenticatorAttachment: string;
  clientExtensionResults?: AuthenticationExtensionsClientOutputs;
  getClientExtensionResults(): AuthenticationExtensionsClientOutputs;
  response: IAuthenticatorAttestationResponse;
}

export interface IPublicKeyCredentialAttestationAsStrings
  extends Omit<IPublicKeyCredentialAttestation, 'response' | 'rawId'> {
  rawId: string;
  response: IAuthenticatorAttestationResponseAsStrings;
}

interface IPublicKeyCredentialDescriptor
  extends Omit<PublicKeyCredentialDescriptor, 'id'> {
  id: string;
}

export interface IPublicKeyCredentialRequestOptionsAsStrings
  extends Omit<
    PublicKeyCredentialRequestOptions,
    'allowCredentials' | 'challenge'
  > {
  allowCredentials: IPublicKeyCredentialDescriptor[];
  challenge: string;
}
