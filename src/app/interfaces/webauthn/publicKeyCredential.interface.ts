export interface IPublicKeyCredentialDescriptor
  extends Omit<PublicKeyCredentialDescriptor, 'id'> {
  id: string;
}

export interface IPublicKeyCredentialUserEntity
  extends Omit<PublicKeyCredentialUserEntity, 'id'> {
  id: string;
}
