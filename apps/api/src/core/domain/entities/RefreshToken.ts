export class RefreshToken {
  constructor(
    public id: number,
    public userId: number,
    public jti: string,
    public family: string,
    public expiresAt: Date,
    public createdAt: Date,
  ) {}
}
