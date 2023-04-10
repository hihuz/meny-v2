import { get } from 'env-var';

export class ApiConfig {
  public static readonly PORT: number = get('PORT').required().asPortNumber();
}
