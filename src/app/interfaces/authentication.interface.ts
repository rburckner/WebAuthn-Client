export interface IAuthenticationResponse {
  token: string;
}

export interface IAuthenticationRequestSubmit extends IDisplayName {}

export interface IDisplayName {
  displayName: string;
  username?: string;
  name?: string;
}

export interface IRegistrationRequestSubmit extends IDisplayName {
  id: string;
}
