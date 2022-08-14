export interface IAuthenticatorAssertionResponse
  extends AuthenticatorAssertionResponse {
  getTransports(): string[];
  getAuthenticatorData(): ArrayBuffer;
  getPublicKey(): ArrayBuffer;
  getPublicKeyAlgorithm(): number;
}
export interface IAuthenticatorAssertionResponseAsStrings {
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;

  publicKey: string | undefined;
  publicKeyAlgorithm: number | undefined;
  transports: string[] | undefined;
  userHandle: string | undefined;
}
