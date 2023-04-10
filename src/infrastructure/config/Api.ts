import { get } from 'env-var';

export class ApiConfig {
  public static readonly HOST: string = get('API_HOST').required().asString();

  public static readonly PORT: number = get('API_PORT')
    .required()
    .asPortNumber();
}
