import { get } from 'env-var';

export class ApiConfig {
  // The name of this variable *must* be 'PORT' as long as we use Scalingo for hosting
  public static readonly PORT: number = get('PORT').required().asPortNumber();

  public static readonly API_VERSION: string = get('API_VERSION')
    .required()
    .asString();

  public static readonly API_NAME?: string = get('API_NAME').asString();

  public static readonly API_DESCRIPTION?: string =
    get('API_DESCRIPTION').asString();

  public static readonly THROTTLER_TTL?: number = get('THROTTLER_TTL').asInt();

  public static readonly THROTTLER_LIMIT?: number =
    get('THROTTLER_TTL').asInt();

  public static readonly DEFAULT_PAGE_SIZE?: number =
    get('DEFAULT_PAGE_SIZE').asInt();

  public static readonly SALT_ROUNDS?: number = get('SALT_ROUNDS').asInt();
}
