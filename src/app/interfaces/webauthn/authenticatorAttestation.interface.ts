export interface IAuthenticatorAttestationResponse
  extends AuthenticatorAttestationResponse {
  getTransports(): string[];
  getAuthenticatorData(): ArrayBuffer;
  getPublicKey(): ArrayBuffer;
  getPublicKeyAlgorithm(): number;
}

export interface IAuthenticatorAttestationResponseAsStrings {
  attestationObject: string;
  clientDataJSON: string;
  transports: string[];

  authenticatorData: string | undefined;
  publicKey: string | undefined;
  publicKeyAlgorithm: number | undefined;
}
