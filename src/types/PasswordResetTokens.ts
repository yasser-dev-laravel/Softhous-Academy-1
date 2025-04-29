export interface PasswordResetToken {
  Id: string;
  Token: string;
  Expires: string;
  IsUsed: boolean;
  UserId: string;
}
