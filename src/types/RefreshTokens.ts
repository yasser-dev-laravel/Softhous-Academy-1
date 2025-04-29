export interface RefreshToken {
  Id: string;
  Token: string;
  Expires: string;
  IsRevoked: boolean;
  IsUsed: boolean;
  UserId: string;
}
