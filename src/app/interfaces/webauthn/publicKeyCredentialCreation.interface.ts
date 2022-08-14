import {
  IPublicKeyCredentialDescriptor,
  IPublicKeyCredentialUserEntity,
} from './publicKeyCredential.interface';

export interface IPublicKeyCredentialCreationOptions
  extends Omit<
    PublicKeyCredentialCreationOptions,
    'challenge' | 'excludeCredentials' | 'user'
  > {
  challenge: string;
  excludeCredentials: IPublicKeyCredentialDescriptor[];
  user: IPublicKeyCredentialUserEntity;
}

export interface IPublicKeyCredentialCreationOptionsRequestResponse {
  publicKey:
    | IPublicKeyCredentialCreationOptions
    | PublicKeyCredentialCreationOptions;
  userId: string;
}

export interface IPublicKeyCredentialRequestOptions
  extends Omit<
    PublicKeyCredentialRequestOptions,
    'allowCredentials' | 'challenge'
  > {
  allowCredentials: IPublicKeyCredentialDescriptor[];
  challenge: string;
}
