export interface User {
  email: string;
  name: string;
}

export interface AuthRes {
  access_token: string;
  token_type: string | 'bearer';
  user: User;
}

export interface CurrentUser {
  email: string;
  method: string | 'jwt';
  claims: {
    sub: number;
    email: string;
    provider: string | 'local';
    exp: number;
  };
}
