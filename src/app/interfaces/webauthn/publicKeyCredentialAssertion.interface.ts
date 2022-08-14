import {
  IAuthenticatorAssertionResponse,
  IAuthenticatorAssertionResponseAsStrings,
} from './authenticatorAssertion.interface';

export interface IPublicKeyCredentialAssertion
  extends Omit<PublicKeyCredential, 'response'> {
  authenticatorAttachment: string;
  clientExtensionResults: AuthenticationExtensionsClientOutputs;
  response: IAuthenticatorAssertionResponse;
}

export interface IPublicKeyCredentialAssertionAsStrings
  extends Omit<IPublicKeyCredentialAssertion, 'response'> {
  response: IAuthenticatorAssertionResponseAsStrings;
}
