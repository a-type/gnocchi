
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export type PrismaPromise<A> = Promise<A> & {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model Profile
 * 
 */
export type Profile = {
  id: string
  fullName: string
  friendlyName: string
  email: string
  imageUrl: string | null
  createdAt: Date
  updatedAt: Date
  planId: string
  isProductAdmin: boolean
}

/**
 * Model Account
 * 
 */
export type Account = {
  id: string
  provider: string
  providerAccountId: string
  type: string
  accessToken: string | null
  refreshToken: string | null
  tokenType: string | null
  createdAt: Date
  updatedAt: Date
  profileId: string
}

/**
 * Model Plan
 * 
 */
export type Plan = {
  id: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  subscriptionExpiresAt: Date | null
  subscriptionCanceledAt: Date | null
  subscriptionStatus: string | null
}

/**
 * Model PlanInvitation
 * 
 */
export type PlanInvitation = {
  id: string
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
  claimedAt: Date | null
  inviterName: string
  inviterId: string
  planId: string
}

/**
 * Model DefaultCategory
 * 
 */
export type DefaultCategory = {
  id: string
  name: string
}

/**
 * Model DefaultFoodCategoryAssignment
 * 
 */
export type DefaultFoodCategoryAssignment = {
  id: string
  categoryId: string
  foodName: string
  votes: number
}


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Profiles
 * const profiles = await prisma.profile.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
      /**
       * @private
       */
      private fetcher;
      /**
       * @private
       */
      private readonly dmmf;
      /**
       * @private
       */
      private connectionPromise?;
      /**
       * @private
       */
      private disconnectionPromise?;
      /**
       * @private
       */
      private readonly engineConfig;
      /**
       * @private
       */
      private readonly measurePerformance;

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Profiles
   * const profiles = await prisma.profile.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P]): Promise<UnwrapTuple<P>>;

      /**
   * `prisma.profile`: Exposes CRUD operations for the **Profile** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Profiles
    * const profiles = await prisma.profile.findMany()
    * ```
    */
  get profile(): Prisma.ProfileDelegate<GlobalReject>;

  /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<GlobalReject>;

  /**
   * `prisma.plan`: Exposes CRUD operations for the **Plan** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Plans
    * const plans = await prisma.plan.findMany()
    * ```
    */
  get plan(): Prisma.PlanDelegate<GlobalReject>;

  /**
   * `prisma.planInvitation`: Exposes CRUD operations for the **PlanInvitation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PlanInvitations
    * const planInvitations = await prisma.planInvitation.findMany()
    * ```
    */
  get planInvitation(): Prisma.PlanInvitationDelegate<GlobalReject>;

  /**
   * `prisma.defaultCategory`: Exposes CRUD operations for the **DefaultCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DefaultCategories
    * const defaultCategories = await prisma.defaultCategory.findMany()
    * ```
    */
  get defaultCategory(): Prisma.DefaultCategoryDelegate<GlobalReject>;

  /**
   * `prisma.defaultFoodCategoryAssignment`: Exposes CRUD operations for the **DefaultFoodCategoryAssignment** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DefaultFoodCategoryAssignments
    * const defaultFoodCategoryAssignments = await prisma.defaultFoodCategoryAssignment.findMany()
    * ```
    */
  get defaultFoodCategoryAssignment(): Prisma.DefaultFoodCategoryAssignmentDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export import Metrics = runtime.Metrics
  export import Metric = runtime.Metric
  export import MetricHistogram = runtime.MetricHistogram
  export import MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
   * Prisma Client JS version: 4.3.1
   * Query Engine version: c875e43600dfe042452e0b868f7a48b817b9640b
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = {
    [key in keyof T]: T[key] extends false | undefined | null ? never : key
  }[keyof T]

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Exact<A, W = unknown> = 
  W extends unknown ? A extends Narrowable ? Cast<A, W> : Cast<
  {[K in keyof A]: K extends keyof W ? Exact<A[K], W[K]> : never},
  {[K in keyof W]: K extends keyof A ? Exact<A[K], W[K]> : W[K]}>
  : never;

  type Narrowable = string | number | boolean | bigint;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: Exact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export import FieldRef = runtime.FieldRef

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Profile: 'Profile',
    Account: 'Account',
    Plan: 'Plan',
    PlanInvitation: 'PlanInvitation',
    DefaultCategory: 'DefaultCategory',
    DefaultFoodCategoryAssignment: 'DefaultFoodCategoryAssignment'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed in to the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ProfileCountOutputType
   */


  export type ProfileCountOutputType = {
    invitations: number
    accounts: number
  }

  export type ProfileCountOutputTypeSelect = {
    invitations?: boolean
    accounts?: boolean
  }

  export type ProfileCountOutputTypeGetPayload<
    S extends boolean | null | undefined | ProfileCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? ProfileCountOutputType
    : S extends undefined
    ? never
    : S extends ProfileCountOutputTypeArgs
    ?'include' extends U
    ? ProfileCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof ProfileCountOutputType ? ProfileCountOutputType[P] : never
  } 
    : ProfileCountOutputType
  : ProfileCountOutputType




  // Custom InputTypes

  /**
   * ProfileCountOutputType without action
   */
  export type ProfileCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the ProfileCountOutputType
     * 
    **/
    select?: ProfileCountOutputTypeSelect | null
  }



  /**
   * Count Type PlanCountOutputType
   */


  export type PlanCountOutputType = {
    members: number
    invitations: number
  }

  export type PlanCountOutputTypeSelect = {
    members?: boolean
    invitations?: boolean
  }

  export type PlanCountOutputTypeGetPayload<
    S extends boolean | null | undefined | PlanCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? PlanCountOutputType
    : S extends undefined
    ? never
    : S extends PlanCountOutputTypeArgs
    ?'include' extends U
    ? PlanCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof PlanCountOutputType ? PlanCountOutputType[P] : never
  } 
    : PlanCountOutputType
  : PlanCountOutputType




  // Custom InputTypes

  /**
   * PlanCountOutputType without action
   */
  export type PlanCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the PlanCountOutputType
     * 
    **/
    select?: PlanCountOutputTypeSelect | null
  }



  /**
   * Count Type DefaultCategoryCountOutputType
   */


  export type DefaultCategoryCountOutputType = {
    foodAssignments: number
  }

  export type DefaultCategoryCountOutputTypeSelect = {
    foodAssignments?: boolean
  }

  export type DefaultCategoryCountOutputTypeGetPayload<
    S extends boolean | null | undefined | DefaultCategoryCountOutputTypeArgs,
    U = keyof S
      > = S extends true
        ? DefaultCategoryCountOutputType
    : S extends undefined
    ? never
    : S extends DefaultCategoryCountOutputTypeArgs
    ?'include' extends U
    ? DefaultCategoryCountOutputType 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
    P extends keyof DefaultCategoryCountOutputType ? DefaultCategoryCountOutputType[P] : never
  } 
    : DefaultCategoryCountOutputType
  : DefaultCategoryCountOutputType




  // Custom InputTypes

  /**
   * DefaultCategoryCountOutputType without action
   */
  export type DefaultCategoryCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the DefaultCategoryCountOutputType
     * 
    **/
    select?: DefaultCategoryCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model Profile
   */


  export type AggregateProfile = {
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  export type ProfileMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    friendlyName: string | null
    email: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
    planId: string | null
    isProductAdmin: boolean | null
  }

  export type ProfileMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    friendlyName: string | null
    email: string | null
    imageUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
    planId: string | null
    isProductAdmin: boolean | null
  }

  export type ProfileCountAggregateOutputType = {
    id: number
    fullName: number
    friendlyName: number
    email: number
    imageUrl: number
    createdAt: number
    updatedAt: number
    planId: number
    isProductAdmin: number
    _all: number
  }


  export type ProfileMinAggregateInputType = {
    id?: true
    fullName?: true
    friendlyName?: true
    email?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    planId?: true
    isProductAdmin?: true
  }

  export type ProfileMaxAggregateInputType = {
    id?: true
    fullName?: true
    friendlyName?: true
    email?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    planId?: true
    isProductAdmin?: true
  }

  export type ProfileCountAggregateInputType = {
    id?: true
    fullName?: true
    friendlyName?: true
    email?: true
    imageUrl?: true
    createdAt?: true
    updatedAt?: true
    planId?: true
    isProductAdmin?: true
    _all?: true
  }

  export type ProfileAggregateArgs = {
    /**
     * Filter which Profile to aggregate.
     * 
    **/
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     * 
    **/
    orderBy?: Enumerable<ProfileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Profiles
    **/
    _count?: true | ProfileCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProfileMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProfileMaxAggregateInputType
  }

  export type GetProfileAggregateType<T extends ProfileAggregateArgs> = {
        [P in keyof T & keyof AggregateProfile]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProfile[P]>
      : GetScalarType<T[P], AggregateProfile[P]>
  }




  export type ProfileGroupByArgs = {
    where?: ProfileWhereInput
    orderBy?: Enumerable<ProfileOrderByWithAggregationInput>
    by: Array<ProfileScalarFieldEnum>
    having?: ProfileScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProfileCountAggregateInputType | true
    _min?: ProfileMinAggregateInputType
    _max?: ProfileMaxAggregateInputType
  }


  export type ProfileGroupByOutputType = {
    id: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl: string | null
    createdAt: Date
    updatedAt: Date
    planId: string
    isProductAdmin: boolean
    _count: ProfileCountAggregateOutputType | null
    _min: ProfileMinAggregateOutputType | null
    _max: ProfileMaxAggregateOutputType | null
  }

  type GetProfileGroupByPayload<T extends ProfileGroupByArgs> = PrismaPromise<
    Array<
      PickArray<ProfileGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProfileGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProfileGroupByOutputType[P]>
            : GetScalarType<T[P], ProfileGroupByOutputType[P]>
        }
      >
    >


  export type ProfileSelect = {
    id?: boolean
    fullName?: boolean
    friendlyName?: boolean
    email?: boolean
    imageUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    planId?: boolean
    plan?: boolean | PlanArgs
    invitations?: boolean | PlanInvitationFindManyArgs
    accounts?: boolean | AccountFindManyArgs
    isProductAdmin?: boolean
    _count?: boolean | ProfileCountOutputTypeArgs
  }

  export type ProfileInclude = {
    plan?: boolean | PlanArgs
    invitations?: boolean | PlanInvitationFindManyArgs
    accounts?: boolean | AccountFindManyArgs
    _count?: boolean | ProfileCountOutputTypeArgs
  }

  export type ProfileGetPayload<
    S extends boolean | null | undefined | ProfileArgs,
    U = keyof S
      > = S extends true
        ? Profile
    : S extends undefined
    ? never
    : S extends ProfileArgs | ProfileFindManyArgs
    ?'include' extends U
    ? Profile  & {
    [P in TrueKeys<S['include']>]:
        P extends 'plan' ? PlanGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'invitations' ? Array < PlanInvitationGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'accounts' ? Array < AccountGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? ProfileCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'plan' ? PlanGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'invitations' ? Array < PlanInvitationGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'accounts' ? Array < AccountGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? ProfileCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Profile ? Profile[P] : never
  } 
    : Profile
  : Profile


  type ProfileCountArgs = Merge<
    Omit<ProfileFindManyArgs, 'select' | 'include'> & {
      select?: ProfileCountAggregateInputType | true
    }
  >

  export interface ProfileDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Profile that matches the filter.
     * @param {ProfileFindUniqueArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends ProfileFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, ProfileFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Profile'> extends True ? CheckSelect<T, Prisma__ProfileClient<Profile>, Prisma__ProfileClient<ProfileGetPayload<T>>> : CheckSelect<T, Prisma__ProfileClient<Profile | null >, Prisma__ProfileClient<ProfileGetPayload<T> | null >>

    /**
     * Find the first Profile that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends ProfileFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, ProfileFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Profile'> extends True ? CheckSelect<T, Prisma__ProfileClient<Profile>, Prisma__ProfileClient<ProfileGetPayload<T>>> : CheckSelect<T, Prisma__ProfileClient<Profile | null >, Prisma__ProfileClient<ProfileGetPayload<T> | null >>

    /**
     * Find zero or more Profiles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Profiles
     * const profiles = await prisma.profile.findMany()
     * 
     * // Get first 10 Profiles
     * const profiles = await prisma.profile.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const profileWithIdOnly = await prisma.profile.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends ProfileFindManyArgs>(
      args?: SelectSubset<T, ProfileFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Profile>>, PrismaPromise<Array<ProfileGetPayload<T>>>>

    /**
     * Create a Profile.
     * @param {ProfileCreateArgs} args - Arguments to create a Profile.
     * @example
     * // Create one Profile
     * const Profile = await prisma.profile.create({
     *   data: {
     *     // ... data to create a Profile
     *   }
     * })
     * 
    **/
    create<T extends ProfileCreateArgs>(
      args: SelectSubset<T, ProfileCreateArgs>
    ): CheckSelect<T, Prisma__ProfileClient<Profile>, Prisma__ProfileClient<ProfileGetPayload<T>>>

    /**
     * Delete a Profile.
     * @param {ProfileDeleteArgs} args - Arguments to delete one Profile.
     * @example
     * // Delete one Profile
     * const Profile = await prisma.profile.delete({
     *   where: {
     *     // ... filter to delete one Profile
     *   }
     * })
     * 
    **/
    delete<T extends ProfileDeleteArgs>(
      args: SelectSubset<T, ProfileDeleteArgs>
    ): CheckSelect<T, Prisma__ProfileClient<Profile>, Prisma__ProfileClient<ProfileGetPayload<T>>>

    /**
     * Update one Profile.
     * @param {ProfileUpdateArgs} args - Arguments to update one Profile.
     * @example
     * // Update one Profile
     * const profile = await prisma.profile.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends ProfileUpdateArgs>(
      args: SelectSubset<T, ProfileUpdateArgs>
    ): CheckSelect<T, Prisma__ProfileClient<Profile>, Prisma__ProfileClient<ProfileGetPayload<T>>>

    /**
     * Delete zero or more Profiles.
     * @param {ProfileDeleteManyArgs} args - Arguments to filter Profiles to delete.
     * @example
     * // Delete a few Profiles
     * const { count } = await prisma.profile.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends ProfileDeleteManyArgs>(
      args?: SelectSubset<T, ProfileDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Profiles
     * const profile = await prisma.profile.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends ProfileUpdateManyArgs>(
      args: SelectSubset<T, ProfileUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Profile.
     * @param {ProfileUpsertArgs} args - Arguments to update or create a Profile.
     * @example
     * // Update or create a Profile
     * const profile = await prisma.profile.upsert({
     *   create: {
     *     // ... data to create a Profile
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Profile we want to update
     *   }
     * })
    **/
    upsert<T extends ProfileUpsertArgs>(
      args: SelectSubset<T, ProfileUpsertArgs>
    ): CheckSelect<T, Prisma__ProfileClient<Profile>, Prisma__ProfileClient<ProfileGetPayload<T>>>

    /**
     * Find one Profile that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {ProfileFindUniqueOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends ProfileFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, ProfileFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__ProfileClient<Profile>, Prisma__ProfileClient<ProfileGetPayload<T>>>

    /**
     * Find the first Profile that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileFindFirstOrThrowArgs} args - Arguments to find a Profile
     * @example
     * // Get one Profile
     * const profile = await prisma.profile.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends ProfileFindFirstOrThrowArgs>(
      args?: SelectSubset<T, ProfileFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__ProfileClient<Profile>, Prisma__ProfileClient<ProfileGetPayload<T>>>

    /**
     * Count the number of Profiles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileCountArgs} args - Arguments to filter Profiles to count.
     * @example
     * // Count the number of Profiles
     * const count = await prisma.profile.count({
     *   where: {
     *     // ... the filter for the Profiles we want to count
     *   }
     * })
    **/
    count<T extends ProfileCountArgs>(
      args?: Subset<T, ProfileCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProfileCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProfileAggregateArgs>(args: Subset<T, ProfileAggregateArgs>): PrismaPromise<GetProfileAggregateType<T>>

    /**
     * Group by Profile.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProfileGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProfileGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProfileGroupByArgs['orderBy'] }
        : { orderBy?: ProfileGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProfileGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProfileGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Profile.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__ProfileClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    plan<T extends PlanArgs = {}>(args?: Subset<T, PlanArgs>): CheckSelect<T, Prisma__PlanClient<Plan | null >, Prisma__PlanClient<PlanGetPayload<T> | null >>;

    invitations<T extends PlanInvitationFindManyArgs = {}>(args?: Subset<T, PlanInvitationFindManyArgs>): CheckSelect<T, PrismaPromise<Array<PlanInvitation>>, PrismaPromise<Array<PlanInvitationGetPayload<T>>>>;

    accounts<T extends AccountFindManyArgs = {}>(args?: Subset<T, AccountFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Account>>, PrismaPromise<Array<AccountGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Profile base type for findUnique actions
   */
  export type ProfileFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Profile
     * 
    **/
    select?: ProfileSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProfileInclude | null
    /**
     * Filter, which Profile to fetch.
     * 
    **/
    where: ProfileWhereUniqueInput
  }

  /**
   * Profile: findUnique
   */
  export interface ProfileFindUniqueArgs extends ProfileFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Profile base type for findFirst actions
   */
  export type ProfileFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Profile
     * 
    **/
    select?: ProfileSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProfileInclude | null
    /**
     * Filter, which Profile to fetch.
     * 
    **/
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     * 
    **/
    orderBy?: Enumerable<ProfileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Profiles.
     * 
    **/
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Profiles.
     * 
    **/
    distinct?: Enumerable<ProfileScalarFieldEnum>
  }

  /**
   * Profile: findFirst
   */
  export interface ProfileFindFirstArgs extends ProfileFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Profile findMany
   */
  export type ProfileFindManyArgs = {
    /**
     * Select specific fields to fetch from the Profile
     * 
    **/
    select?: ProfileSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProfileInclude | null
    /**
     * Filter, which Profiles to fetch.
     * 
    **/
    where?: ProfileWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Profiles to fetch.
     * 
    **/
    orderBy?: Enumerable<ProfileOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Profiles.
     * 
    **/
    cursor?: ProfileWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Profiles from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Profiles.
     * 
    **/
    skip?: number
    distinct?: Enumerable<ProfileScalarFieldEnum>
  }


  /**
   * Profile create
   */
  export type ProfileCreateArgs = {
    /**
     * Select specific fields to fetch from the Profile
     * 
    **/
    select?: ProfileSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProfileInclude | null
    /**
     * The data needed to create a Profile.
     * 
    **/
    data: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
  }


  /**
   * Profile update
   */
  export type ProfileUpdateArgs = {
    /**
     * Select specific fields to fetch from the Profile
     * 
    **/
    select?: ProfileSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProfileInclude | null
    /**
     * The data needed to update a Profile.
     * 
    **/
    data: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
    /**
     * Choose, which Profile to update.
     * 
    **/
    where: ProfileWhereUniqueInput
  }


  /**
   * Profile updateMany
   */
  export type ProfileUpdateManyArgs = {
    /**
     * The data used to update Profiles.
     * 
    **/
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyInput>
    /**
     * Filter which Profiles to update
     * 
    **/
    where?: ProfileWhereInput
  }


  /**
   * Profile upsert
   */
  export type ProfileUpsertArgs = {
    /**
     * Select specific fields to fetch from the Profile
     * 
    **/
    select?: ProfileSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProfileInclude | null
    /**
     * The filter to search for the Profile to update in case it exists.
     * 
    **/
    where: ProfileWhereUniqueInput
    /**
     * In case the Profile found by the `where` argument doesn't exist, create a new Profile with this data.
     * 
    **/
    create: XOR<ProfileCreateInput, ProfileUncheckedCreateInput>
    /**
     * In case the Profile was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<ProfileUpdateInput, ProfileUncheckedUpdateInput>
  }


  /**
   * Profile delete
   */
  export type ProfileDeleteArgs = {
    /**
     * Select specific fields to fetch from the Profile
     * 
    **/
    select?: ProfileSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProfileInclude | null
    /**
     * Filter which Profile to delete.
     * 
    **/
    where: ProfileWhereUniqueInput
  }


  /**
   * Profile deleteMany
   */
  export type ProfileDeleteManyArgs = {
    /**
     * Filter which Profiles to delete
     * 
    **/
    where?: ProfileWhereInput
  }


  /**
   * Profile: findUniqueOrThrow
   */
  export type ProfileFindUniqueOrThrowArgs = ProfileFindUniqueArgsBase
      

  /**
   * Profile: findFirstOrThrow
   */
  export type ProfileFindFirstOrThrowArgs = ProfileFindFirstArgsBase
      

  /**
   * Profile without action
   */
  export type ProfileArgs = {
    /**
     * Select specific fields to fetch from the Profile
     * 
    **/
    select?: ProfileSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: ProfileInclude | null
  }



  /**
   * Model Account
   */


  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    provider: string | null
    providerAccountId: string | null
    type: string | null
    accessToken: string | null
    refreshToken: string | null
    tokenType: string | null
    createdAt: Date | null
    updatedAt: Date | null
    profileId: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    provider: string | null
    providerAccountId: string | null
    type: string | null
    accessToken: string | null
    refreshToken: string | null
    tokenType: string | null
    createdAt: Date | null
    updatedAt: Date | null
    profileId: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    provider: number
    providerAccountId: number
    type: number
    accessToken: number
    refreshToken: number
    tokenType: number
    createdAt: number
    updatedAt: number
    profileId: number
    _all: number
  }


  export type AccountMinAggregateInputType = {
    id?: true
    provider?: true
    providerAccountId?: true
    type?: true
    accessToken?: true
    refreshToken?: true
    tokenType?: true
    createdAt?: true
    updatedAt?: true
    profileId?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    provider?: true
    providerAccountId?: true
    type?: true
    accessToken?: true
    refreshToken?: true
    tokenType?: true
    createdAt?: true
    updatedAt?: true
    profileId?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    provider?: true
    providerAccountId?: true
    type?: true
    accessToken?: true
    refreshToken?: true
    tokenType?: true
    createdAt?: true
    updatedAt?: true
    profileId?: true
    _all?: true
  }

  export type AccountAggregateArgs = {
    /**
     * Filter which Account to aggregate.
     * 
    **/
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     * 
    **/
    orderBy?: Enumerable<AccountOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs = {
    where?: AccountWhereInput
    orderBy?: Enumerable<AccountOrderByWithAggregationInput>
    by: Array<AccountScalarFieldEnum>
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }


  export type AccountGroupByOutputType = {
    id: string
    provider: string
    providerAccountId: string
    type: string
    accessToken: string | null
    refreshToken: string | null
    tokenType: string | null
    createdAt: Date
    updatedAt: Date
    profileId: string
    _count: AccountCountAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = PrismaPromise<
    Array<
      PickArray<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect = {
    id?: boolean
    provider?: boolean
    providerAccountId?: boolean
    type?: boolean
    accessToken?: boolean
    refreshToken?: boolean
    tokenType?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    profileId?: boolean
    profile?: boolean | ProfileArgs
  }

  export type AccountInclude = {
    profile?: boolean | ProfileArgs
  }

  export type AccountGetPayload<
    S extends boolean | null | undefined | AccountArgs,
    U = keyof S
      > = S extends true
        ? Account
    : S extends undefined
    ? never
    : S extends AccountArgs | AccountFindManyArgs
    ?'include' extends U
    ? Account  & {
    [P in TrueKeys<S['include']>]:
        P extends 'profile' ? ProfileGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'profile' ? ProfileGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Account ? Account[P] : never
  } 
    : Account
  : Account


  type AccountCountArgs = Merge<
    Omit<AccountFindManyArgs, 'select' | 'include'> & {
      select?: AccountCountAggregateInputType | true
    }
  >

  export interface AccountDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends AccountFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, AccountFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Account'> extends True ? CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>> : CheckSelect<T, Prisma__AccountClient<Account | null >, Prisma__AccountClient<AccountGetPayload<T> | null >>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends AccountFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, AccountFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Account'> extends True ? CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>> : CheckSelect<T, Prisma__AccountClient<Account | null >, Prisma__AccountClient<AccountGetPayload<T> | null >>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends AccountFindManyArgs>(
      args?: SelectSubset<T, AccountFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Account>>, PrismaPromise<Array<AccountGetPayload<T>>>>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
    **/
    create<T extends AccountCreateArgs>(
      args: SelectSubset<T, AccountCreateArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
    **/
    delete<T extends AccountDeleteArgs>(
      args: SelectSubset<T, AccountDeleteArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends AccountUpdateArgs>(
      args: SelectSubset<T, AccountUpdateArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends AccountDeleteManyArgs>(
      args?: SelectSubset<T, AccountDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends AccountUpdateManyArgs>(
      args: SelectSubset<T, AccountUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
    **/
    upsert<T extends AccountUpsertArgs>(
      args: SelectSubset<T, AccountUpsertArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Find one Account that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, AccountFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Find the first Account that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(
      args?: SelectSubset<T, AccountFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__AccountClient<Account>, Prisma__AccountClient<AccountGetPayload<T>>>

    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__AccountClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    profile<T extends ProfileArgs = {}>(args?: Subset<T, ProfileArgs>): CheckSelect<T, Prisma__ProfileClient<Profile | null >, Prisma__ProfileClient<ProfileGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Account base type for findUnique actions
   */
  export type AccountFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Account
     * 
    **/
    select?: AccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: AccountInclude | null
    /**
     * Filter, which Account to fetch.
     * 
    **/
    where: AccountWhereUniqueInput
  }

  /**
   * Account: findUnique
   */
  export interface AccountFindUniqueArgs extends AccountFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Account base type for findFirst actions
   */
  export type AccountFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Account
     * 
    **/
    select?: AccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: AccountInclude | null
    /**
     * Filter, which Account to fetch.
     * 
    **/
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     * 
    **/
    orderBy?: Enumerable<AccountOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     * 
    **/
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     * 
    **/
    distinct?: Enumerable<AccountScalarFieldEnum>
  }

  /**
   * Account: findFirst
   */
  export interface AccountFindFirstArgs extends AccountFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Account findMany
   */
  export type AccountFindManyArgs = {
    /**
     * Select specific fields to fetch from the Account
     * 
    **/
    select?: AccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: AccountInclude | null
    /**
     * Filter, which Accounts to fetch.
     * 
    **/
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     * 
    **/
    orderBy?: Enumerable<AccountOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     * 
    **/
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     * 
    **/
    skip?: number
    distinct?: Enumerable<AccountScalarFieldEnum>
  }


  /**
   * Account create
   */
  export type AccountCreateArgs = {
    /**
     * Select specific fields to fetch from the Account
     * 
    **/
    select?: AccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: AccountInclude | null
    /**
     * The data needed to create a Account.
     * 
    **/
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }


  /**
   * Account update
   */
  export type AccountUpdateArgs = {
    /**
     * Select specific fields to fetch from the Account
     * 
    **/
    select?: AccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: AccountInclude | null
    /**
     * The data needed to update a Account.
     * 
    **/
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     * 
    **/
    where: AccountWhereUniqueInput
  }


  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs = {
    /**
     * The data used to update Accounts.
     * 
    **/
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     * 
    **/
    where?: AccountWhereInput
  }


  /**
   * Account upsert
   */
  export type AccountUpsertArgs = {
    /**
     * Select specific fields to fetch from the Account
     * 
    **/
    select?: AccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: AccountInclude | null
    /**
     * The filter to search for the Account to update in case it exists.
     * 
    **/
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     * 
    **/
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }


  /**
   * Account delete
   */
  export type AccountDeleteArgs = {
    /**
     * Select specific fields to fetch from the Account
     * 
    **/
    select?: AccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: AccountInclude | null
    /**
     * Filter which Account to delete.
     * 
    **/
    where: AccountWhereUniqueInput
  }


  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs = {
    /**
     * Filter which Accounts to delete
     * 
    **/
    where?: AccountWhereInput
  }


  /**
   * Account: findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs = AccountFindUniqueArgsBase
      

  /**
   * Account: findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs = AccountFindFirstArgsBase
      

  /**
   * Account without action
   */
  export type AccountArgs = {
    /**
     * Select specific fields to fetch from the Account
     * 
    **/
    select?: AccountSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: AccountInclude | null
  }



  /**
   * Model Plan
   */


  export type AggregatePlan = {
    _count: PlanCountAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  export type PlanMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    subscriptionExpiresAt: Date | null
    subscriptionCanceledAt: Date | null
    subscriptionStatus: string | null
  }

  export type PlanMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    subscriptionExpiresAt: Date | null
    subscriptionCanceledAt: Date | null
    subscriptionStatus: string | null
  }

  export type PlanCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    stripeCustomerId: number
    stripeSubscriptionId: number
    subscriptionExpiresAt: number
    subscriptionCanceledAt: number
    subscriptionStatus: number
    _all: number
  }


  export type PlanMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    subscriptionExpiresAt?: true
    subscriptionCanceledAt?: true
    subscriptionStatus?: true
  }

  export type PlanMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    subscriptionExpiresAt?: true
    subscriptionCanceledAt?: true
    subscriptionStatus?: true
  }

  export type PlanCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    stripeCustomerId?: true
    stripeSubscriptionId?: true
    subscriptionExpiresAt?: true
    subscriptionCanceledAt?: true
    subscriptionStatus?: true
    _all?: true
  }

  export type PlanAggregateArgs = {
    /**
     * Filter which Plan to aggregate.
     * 
    **/
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     * 
    **/
    orderBy?: Enumerable<PlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Plans
    **/
    _count?: true | PlanCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanMaxAggregateInputType
  }

  export type GetPlanAggregateType<T extends PlanAggregateArgs> = {
        [P in keyof T & keyof AggregatePlan]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlan[P]>
      : GetScalarType<T[P], AggregatePlan[P]>
  }




  export type PlanGroupByArgs = {
    where?: PlanWhereInput
    orderBy?: Enumerable<PlanOrderByWithAggregationInput>
    by: Array<PlanScalarFieldEnum>
    having?: PlanScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanCountAggregateInputType | true
    _min?: PlanMinAggregateInputType
    _max?: PlanMaxAggregateInputType
  }


  export type PlanGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    stripeCustomerId: string | null
    stripeSubscriptionId: string | null
    subscriptionExpiresAt: Date | null
    subscriptionCanceledAt: Date | null
    subscriptionStatus: string | null
    _count: PlanCountAggregateOutputType | null
    _min: PlanMinAggregateOutputType | null
    _max: PlanMaxAggregateOutputType | null
  }

  type GetPlanGroupByPayload<T extends PlanGroupByArgs> = PrismaPromise<
    Array<
      PickArray<PlanGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanGroupByOutputType[P]>
            : GetScalarType<T[P], PlanGroupByOutputType[P]>
        }
      >
    >


  export type PlanSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    stripeCustomerId?: boolean
    stripeSubscriptionId?: boolean
    subscriptionExpiresAt?: boolean
    subscriptionCanceledAt?: boolean
    subscriptionStatus?: boolean
    members?: boolean | ProfileFindManyArgs
    invitations?: boolean | PlanInvitationFindManyArgs
    _count?: boolean | PlanCountOutputTypeArgs
  }

  export type PlanInclude = {
    members?: boolean | ProfileFindManyArgs
    invitations?: boolean | PlanInvitationFindManyArgs
    _count?: boolean | PlanCountOutputTypeArgs
  }

  export type PlanGetPayload<
    S extends boolean | null | undefined | PlanArgs,
    U = keyof S
      > = S extends true
        ? Plan
    : S extends undefined
    ? never
    : S extends PlanArgs | PlanFindManyArgs
    ?'include' extends U
    ? Plan  & {
    [P in TrueKeys<S['include']>]:
        P extends 'members' ? Array < ProfileGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends 'invitations' ? Array < PlanInvitationGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? PlanCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'members' ? Array < ProfileGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends 'invitations' ? Array < PlanInvitationGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? PlanCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof Plan ? Plan[P] : never
  } 
    : Plan
  : Plan


  type PlanCountArgs = Merge<
    Omit<PlanFindManyArgs, 'select' | 'include'> & {
      select?: PlanCountAggregateInputType | true
    }
  >

  export interface PlanDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one Plan that matches the filter.
     * @param {PlanFindUniqueArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PlanFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, PlanFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Plan'> extends True ? CheckSelect<T, Prisma__PlanClient<Plan>, Prisma__PlanClient<PlanGetPayload<T>>> : CheckSelect<T, Prisma__PlanClient<Plan | null >, Prisma__PlanClient<PlanGetPayload<T> | null >>

    /**
     * Find the first Plan that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PlanFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, PlanFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Plan'> extends True ? CheckSelect<T, Prisma__PlanClient<Plan>, Prisma__PlanClient<PlanGetPayload<T>>> : CheckSelect<T, Prisma__PlanClient<Plan | null >, Prisma__PlanClient<PlanGetPayload<T> | null >>

    /**
     * Find zero or more Plans that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Plans
     * const plans = await prisma.plan.findMany()
     * 
     * // Get first 10 Plans
     * const plans = await prisma.plan.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planWithIdOnly = await prisma.plan.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends PlanFindManyArgs>(
      args?: SelectSubset<T, PlanFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<Plan>>, PrismaPromise<Array<PlanGetPayload<T>>>>

    /**
     * Create a Plan.
     * @param {PlanCreateArgs} args - Arguments to create a Plan.
     * @example
     * // Create one Plan
     * const Plan = await prisma.plan.create({
     *   data: {
     *     // ... data to create a Plan
     *   }
     * })
     * 
    **/
    create<T extends PlanCreateArgs>(
      args: SelectSubset<T, PlanCreateArgs>
    ): CheckSelect<T, Prisma__PlanClient<Plan>, Prisma__PlanClient<PlanGetPayload<T>>>

    /**
     * Delete a Plan.
     * @param {PlanDeleteArgs} args - Arguments to delete one Plan.
     * @example
     * // Delete one Plan
     * const Plan = await prisma.plan.delete({
     *   where: {
     *     // ... filter to delete one Plan
     *   }
     * })
     * 
    **/
    delete<T extends PlanDeleteArgs>(
      args: SelectSubset<T, PlanDeleteArgs>
    ): CheckSelect<T, Prisma__PlanClient<Plan>, Prisma__PlanClient<PlanGetPayload<T>>>

    /**
     * Update one Plan.
     * @param {PlanUpdateArgs} args - Arguments to update one Plan.
     * @example
     * // Update one Plan
     * const plan = await prisma.plan.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PlanUpdateArgs>(
      args: SelectSubset<T, PlanUpdateArgs>
    ): CheckSelect<T, Prisma__PlanClient<Plan>, Prisma__PlanClient<PlanGetPayload<T>>>

    /**
     * Delete zero or more Plans.
     * @param {PlanDeleteManyArgs} args - Arguments to filter Plans to delete.
     * @example
     * // Delete a few Plans
     * const { count } = await prisma.plan.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PlanDeleteManyArgs>(
      args?: SelectSubset<T, PlanDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Plans
     * const plan = await prisma.plan.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PlanUpdateManyArgs>(
      args: SelectSubset<T, PlanUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Plan.
     * @param {PlanUpsertArgs} args - Arguments to update or create a Plan.
     * @example
     * // Update or create a Plan
     * const plan = await prisma.plan.upsert({
     *   create: {
     *     // ... data to create a Plan
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Plan we want to update
     *   }
     * })
    **/
    upsert<T extends PlanUpsertArgs>(
      args: SelectSubset<T, PlanUpsertArgs>
    ): CheckSelect<T, Prisma__PlanClient<Plan>, Prisma__PlanClient<PlanGetPayload<T>>>

    /**
     * Find one Plan that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {PlanFindUniqueOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PlanFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, PlanFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__PlanClient<Plan>, Prisma__PlanClient<PlanGetPayload<T>>>

    /**
     * Find the first Plan that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanFindFirstOrThrowArgs} args - Arguments to find a Plan
     * @example
     * // Get one Plan
     * const plan = await prisma.plan.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PlanFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PlanFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__PlanClient<Plan>, Prisma__PlanClient<PlanGetPayload<T>>>

    /**
     * Count the number of Plans.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanCountArgs} args - Arguments to filter Plans to count.
     * @example
     * // Count the number of Plans
     * const count = await prisma.plan.count({
     *   where: {
     *     // ... the filter for the Plans we want to count
     *   }
     * })
    **/
    count<T extends PlanCountArgs>(
      args?: Subset<T, PlanCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanAggregateArgs>(args: Subset<T, PlanAggregateArgs>): PrismaPromise<GetPlanAggregateType<T>>

    /**
     * Group by Plan.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanGroupByArgs['orderBy'] }
        : { orderBy?: PlanGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Plan.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PlanClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    members<T extends ProfileFindManyArgs = {}>(args?: Subset<T, ProfileFindManyArgs>): CheckSelect<T, PrismaPromise<Array<Profile>>, PrismaPromise<Array<ProfileGetPayload<T>>>>;

    invitations<T extends PlanInvitationFindManyArgs = {}>(args?: Subset<T, PlanInvitationFindManyArgs>): CheckSelect<T, PrismaPromise<Array<PlanInvitation>>, PrismaPromise<Array<PlanInvitationGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Plan base type for findUnique actions
   */
  export type PlanFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Plan
     * 
    **/
    select?: PlanSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInclude | null
    /**
     * Filter, which Plan to fetch.
     * 
    **/
    where: PlanWhereUniqueInput
  }

  /**
   * Plan: findUnique
   */
  export interface PlanFindUniqueArgs extends PlanFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Plan base type for findFirst actions
   */
  export type PlanFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Plan
     * 
    **/
    select?: PlanSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInclude | null
    /**
     * Filter, which Plan to fetch.
     * 
    **/
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     * 
    **/
    orderBy?: Enumerable<PlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Plans.
     * 
    **/
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Plans.
     * 
    **/
    distinct?: Enumerable<PlanScalarFieldEnum>
  }

  /**
   * Plan: findFirst
   */
  export interface PlanFindFirstArgs extends PlanFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Plan findMany
   */
  export type PlanFindManyArgs = {
    /**
     * Select specific fields to fetch from the Plan
     * 
    **/
    select?: PlanSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInclude | null
    /**
     * Filter, which Plans to fetch.
     * 
    **/
    where?: PlanWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Plans to fetch.
     * 
    **/
    orderBy?: Enumerable<PlanOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Plans.
     * 
    **/
    cursor?: PlanWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Plans from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Plans.
     * 
    **/
    skip?: number
    distinct?: Enumerable<PlanScalarFieldEnum>
  }


  /**
   * Plan create
   */
  export type PlanCreateArgs = {
    /**
     * Select specific fields to fetch from the Plan
     * 
    **/
    select?: PlanSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInclude | null
    /**
     * The data needed to create a Plan.
     * 
    **/
    data: XOR<PlanCreateInput, PlanUncheckedCreateInput>
  }


  /**
   * Plan update
   */
  export type PlanUpdateArgs = {
    /**
     * Select specific fields to fetch from the Plan
     * 
    **/
    select?: PlanSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInclude | null
    /**
     * The data needed to update a Plan.
     * 
    **/
    data: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
    /**
     * Choose, which Plan to update.
     * 
    **/
    where: PlanWhereUniqueInput
  }


  /**
   * Plan updateMany
   */
  export type PlanUpdateManyArgs = {
    /**
     * The data used to update Plans.
     * 
    **/
    data: XOR<PlanUpdateManyMutationInput, PlanUncheckedUpdateManyInput>
    /**
     * Filter which Plans to update
     * 
    **/
    where?: PlanWhereInput
  }


  /**
   * Plan upsert
   */
  export type PlanUpsertArgs = {
    /**
     * Select specific fields to fetch from the Plan
     * 
    **/
    select?: PlanSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInclude | null
    /**
     * The filter to search for the Plan to update in case it exists.
     * 
    **/
    where: PlanWhereUniqueInput
    /**
     * In case the Plan found by the `where` argument doesn't exist, create a new Plan with this data.
     * 
    **/
    create: XOR<PlanCreateInput, PlanUncheckedCreateInput>
    /**
     * In case the Plan was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<PlanUpdateInput, PlanUncheckedUpdateInput>
  }


  /**
   * Plan delete
   */
  export type PlanDeleteArgs = {
    /**
     * Select specific fields to fetch from the Plan
     * 
    **/
    select?: PlanSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInclude | null
    /**
     * Filter which Plan to delete.
     * 
    **/
    where: PlanWhereUniqueInput
  }


  /**
   * Plan deleteMany
   */
  export type PlanDeleteManyArgs = {
    /**
     * Filter which Plans to delete
     * 
    **/
    where?: PlanWhereInput
  }


  /**
   * Plan: findUniqueOrThrow
   */
  export type PlanFindUniqueOrThrowArgs = PlanFindUniqueArgsBase
      

  /**
   * Plan: findFirstOrThrow
   */
  export type PlanFindFirstOrThrowArgs = PlanFindFirstArgsBase
      

  /**
   * Plan without action
   */
  export type PlanArgs = {
    /**
     * Select specific fields to fetch from the Plan
     * 
    **/
    select?: PlanSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInclude | null
  }



  /**
   * Model PlanInvitation
   */


  export type AggregatePlanInvitation = {
    _count: PlanInvitationCountAggregateOutputType | null
    _min: PlanInvitationMinAggregateOutputType | null
    _max: PlanInvitationMaxAggregateOutputType | null
  }

  export type PlanInvitationMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    expiresAt: Date | null
    claimedAt: Date | null
    inviterName: string | null
    inviterId: string | null
    planId: string | null
  }

  export type PlanInvitationMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    expiresAt: Date | null
    claimedAt: Date | null
    inviterName: string | null
    inviterId: string | null
    planId: string | null
  }

  export type PlanInvitationCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    expiresAt: number
    claimedAt: number
    inviterName: number
    inviterId: number
    planId: number
    _all: number
  }


  export type PlanInvitationMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
    claimedAt?: true
    inviterName?: true
    inviterId?: true
    planId?: true
  }

  export type PlanInvitationMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
    claimedAt?: true
    inviterName?: true
    inviterId?: true
    planId?: true
  }

  export type PlanInvitationCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    expiresAt?: true
    claimedAt?: true
    inviterName?: true
    inviterId?: true
    planId?: true
    _all?: true
  }

  export type PlanInvitationAggregateArgs = {
    /**
     * Filter which PlanInvitation to aggregate.
     * 
    **/
    where?: PlanInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanInvitations to fetch.
     * 
    **/
    orderBy?: Enumerable<PlanInvitationOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: PlanInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanInvitations from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanInvitations.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PlanInvitations
    **/
    _count?: true | PlanInvitationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PlanInvitationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PlanInvitationMaxAggregateInputType
  }

  export type GetPlanInvitationAggregateType<T extends PlanInvitationAggregateArgs> = {
        [P in keyof T & keyof AggregatePlanInvitation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePlanInvitation[P]>
      : GetScalarType<T[P], AggregatePlanInvitation[P]>
  }




  export type PlanInvitationGroupByArgs = {
    where?: PlanInvitationWhereInput
    orderBy?: Enumerable<PlanInvitationOrderByWithAggregationInput>
    by: Array<PlanInvitationScalarFieldEnum>
    having?: PlanInvitationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PlanInvitationCountAggregateInputType | true
    _min?: PlanInvitationMinAggregateInputType
    _max?: PlanInvitationMaxAggregateInputType
  }


  export type PlanInvitationGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    claimedAt: Date | null
    inviterName: string
    inviterId: string
    planId: string
    _count: PlanInvitationCountAggregateOutputType | null
    _min: PlanInvitationMinAggregateOutputType | null
    _max: PlanInvitationMaxAggregateOutputType | null
  }

  type GetPlanInvitationGroupByPayload<T extends PlanInvitationGroupByArgs> = PrismaPromise<
    Array<
      PickArray<PlanInvitationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PlanInvitationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PlanInvitationGroupByOutputType[P]>
            : GetScalarType<T[P], PlanInvitationGroupByOutputType[P]>
        }
      >
    >


  export type PlanInvitationSelect = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    expiresAt?: boolean
    claimedAt?: boolean
    inviterName?: boolean
    inviterId?: boolean
    inviter?: boolean | ProfileArgs
    planId?: boolean
    plan?: boolean | PlanArgs
  }

  export type PlanInvitationInclude = {
    inviter?: boolean | ProfileArgs
    plan?: boolean | PlanArgs
  }

  export type PlanInvitationGetPayload<
    S extends boolean | null | undefined | PlanInvitationArgs,
    U = keyof S
      > = S extends true
        ? PlanInvitation
    : S extends undefined
    ? never
    : S extends PlanInvitationArgs | PlanInvitationFindManyArgs
    ?'include' extends U
    ? PlanInvitation  & {
    [P in TrueKeys<S['include']>]:
        P extends 'inviter' ? ProfileGetPayload<Exclude<S['include'], undefined | null>[P]> :
        P extends 'plan' ? PlanGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'inviter' ? ProfileGetPayload<Exclude<S['select'], undefined | null>[P]> :
        P extends 'plan' ? PlanGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof PlanInvitation ? PlanInvitation[P] : never
  } 
    : PlanInvitation
  : PlanInvitation


  type PlanInvitationCountArgs = Merge<
    Omit<PlanInvitationFindManyArgs, 'select' | 'include'> & {
      select?: PlanInvitationCountAggregateInputType | true
    }
  >

  export interface PlanInvitationDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one PlanInvitation that matches the filter.
     * @param {PlanInvitationFindUniqueArgs} args - Arguments to find a PlanInvitation
     * @example
     * // Get one PlanInvitation
     * const planInvitation = await prisma.planInvitation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PlanInvitationFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, PlanInvitationFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'PlanInvitation'> extends True ? CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation>, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T>>> : CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation | null >, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T> | null >>

    /**
     * Find the first PlanInvitation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanInvitationFindFirstArgs} args - Arguments to find a PlanInvitation
     * @example
     * // Get one PlanInvitation
     * const planInvitation = await prisma.planInvitation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PlanInvitationFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, PlanInvitationFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'PlanInvitation'> extends True ? CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation>, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T>>> : CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation | null >, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T> | null >>

    /**
     * Find zero or more PlanInvitations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanInvitationFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PlanInvitations
     * const planInvitations = await prisma.planInvitation.findMany()
     * 
     * // Get first 10 PlanInvitations
     * const planInvitations = await prisma.planInvitation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const planInvitationWithIdOnly = await prisma.planInvitation.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends PlanInvitationFindManyArgs>(
      args?: SelectSubset<T, PlanInvitationFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<PlanInvitation>>, PrismaPromise<Array<PlanInvitationGetPayload<T>>>>

    /**
     * Create a PlanInvitation.
     * @param {PlanInvitationCreateArgs} args - Arguments to create a PlanInvitation.
     * @example
     * // Create one PlanInvitation
     * const PlanInvitation = await prisma.planInvitation.create({
     *   data: {
     *     // ... data to create a PlanInvitation
     *   }
     * })
     * 
    **/
    create<T extends PlanInvitationCreateArgs>(
      args: SelectSubset<T, PlanInvitationCreateArgs>
    ): CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation>, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T>>>

    /**
     * Delete a PlanInvitation.
     * @param {PlanInvitationDeleteArgs} args - Arguments to delete one PlanInvitation.
     * @example
     * // Delete one PlanInvitation
     * const PlanInvitation = await prisma.planInvitation.delete({
     *   where: {
     *     // ... filter to delete one PlanInvitation
     *   }
     * })
     * 
    **/
    delete<T extends PlanInvitationDeleteArgs>(
      args: SelectSubset<T, PlanInvitationDeleteArgs>
    ): CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation>, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T>>>

    /**
     * Update one PlanInvitation.
     * @param {PlanInvitationUpdateArgs} args - Arguments to update one PlanInvitation.
     * @example
     * // Update one PlanInvitation
     * const planInvitation = await prisma.planInvitation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PlanInvitationUpdateArgs>(
      args: SelectSubset<T, PlanInvitationUpdateArgs>
    ): CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation>, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T>>>

    /**
     * Delete zero or more PlanInvitations.
     * @param {PlanInvitationDeleteManyArgs} args - Arguments to filter PlanInvitations to delete.
     * @example
     * // Delete a few PlanInvitations
     * const { count } = await prisma.planInvitation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PlanInvitationDeleteManyArgs>(
      args?: SelectSubset<T, PlanInvitationDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more PlanInvitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanInvitationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PlanInvitations
     * const planInvitation = await prisma.planInvitation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PlanInvitationUpdateManyArgs>(
      args: SelectSubset<T, PlanInvitationUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one PlanInvitation.
     * @param {PlanInvitationUpsertArgs} args - Arguments to update or create a PlanInvitation.
     * @example
     * // Update or create a PlanInvitation
     * const planInvitation = await prisma.planInvitation.upsert({
     *   create: {
     *     // ... data to create a PlanInvitation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PlanInvitation we want to update
     *   }
     * })
    **/
    upsert<T extends PlanInvitationUpsertArgs>(
      args: SelectSubset<T, PlanInvitationUpsertArgs>
    ): CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation>, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T>>>

    /**
     * Find one PlanInvitation that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {PlanInvitationFindUniqueOrThrowArgs} args - Arguments to find a PlanInvitation
     * @example
     * // Get one PlanInvitation
     * const planInvitation = await prisma.planInvitation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PlanInvitationFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, PlanInvitationFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation>, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T>>>

    /**
     * Find the first PlanInvitation that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanInvitationFindFirstOrThrowArgs} args - Arguments to find a PlanInvitation
     * @example
     * // Get one PlanInvitation
     * const planInvitation = await prisma.planInvitation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PlanInvitationFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PlanInvitationFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__PlanInvitationClient<PlanInvitation>, Prisma__PlanInvitationClient<PlanInvitationGetPayload<T>>>

    /**
     * Count the number of PlanInvitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanInvitationCountArgs} args - Arguments to filter PlanInvitations to count.
     * @example
     * // Count the number of PlanInvitations
     * const count = await prisma.planInvitation.count({
     *   where: {
     *     // ... the filter for the PlanInvitations we want to count
     *   }
     * })
    **/
    count<T extends PlanInvitationCountArgs>(
      args?: Subset<T, PlanInvitationCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PlanInvitationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PlanInvitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanInvitationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PlanInvitationAggregateArgs>(args: Subset<T, PlanInvitationAggregateArgs>): PrismaPromise<GetPlanInvitationAggregateType<T>>

    /**
     * Group by PlanInvitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PlanInvitationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PlanInvitationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PlanInvitationGroupByArgs['orderBy'] }
        : { orderBy?: PlanInvitationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PlanInvitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanInvitationGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for PlanInvitation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PlanInvitationClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    inviter<T extends ProfileArgs = {}>(args?: Subset<T, ProfileArgs>): CheckSelect<T, Prisma__ProfileClient<Profile | null >, Prisma__ProfileClient<ProfileGetPayload<T> | null >>;

    plan<T extends PlanArgs = {}>(args?: Subset<T, PlanArgs>): CheckSelect<T, Prisma__PlanClient<Plan | null >, Prisma__PlanClient<PlanGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * PlanInvitation base type for findUnique actions
   */
  export type PlanInvitationFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the PlanInvitation
     * 
    **/
    select?: PlanInvitationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInvitationInclude | null
    /**
     * Filter, which PlanInvitation to fetch.
     * 
    **/
    where: PlanInvitationWhereUniqueInput
  }

  /**
   * PlanInvitation: findUnique
   */
  export interface PlanInvitationFindUniqueArgs extends PlanInvitationFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * PlanInvitation base type for findFirst actions
   */
  export type PlanInvitationFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the PlanInvitation
     * 
    **/
    select?: PlanInvitationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInvitationInclude | null
    /**
     * Filter, which PlanInvitation to fetch.
     * 
    **/
    where?: PlanInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanInvitations to fetch.
     * 
    **/
    orderBy?: Enumerable<PlanInvitationOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PlanInvitations.
     * 
    **/
    cursor?: PlanInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanInvitations from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanInvitations.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PlanInvitations.
     * 
    **/
    distinct?: Enumerable<PlanInvitationScalarFieldEnum>
  }

  /**
   * PlanInvitation: findFirst
   */
  export interface PlanInvitationFindFirstArgs extends PlanInvitationFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * PlanInvitation findMany
   */
  export type PlanInvitationFindManyArgs = {
    /**
     * Select specific fields to fetch from the PlanInvitation
     * 
    **/
    select?: PlanInvitationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInvitationInclude | null
    /**
     * Filter, which PlanInvitations to fetch.
     * 
    **/
    where?: PlanInvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PlanInvitations to fetch.
     * 
    **/
    orderBy?: Enumerable<PlanInvitationOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PlanInvitations.
     * 
    **/
    cursor?: PlanInvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PlanInvitations from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PlanInvitations.
     * 
    **/
    skip?: number
    distinct?: Enumerable<PlanInvitationScalarFieldEnum>
  }


  /**
   * PlanInvitation create
   */
  export type PlanInvitationCreateArgs = {
    /**
     * Select specific fields to fetch from the PlanInvitation
     * 
    **/
    select?: PlanInvitationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInvitationInclude | null
    /**
     * The data needed to create a PlanInvitation.
     * 
    **/
    data: XOR<PlanInvitationCreateInput, PlanInvitationUncheckedCreateInput>
  }


  /**
   * PlanInvitation update
   */
  export type PlanInvitationUpdateArgs = {
    /**
     * Select specific fields to fetch from the PlanInvitation
     * 
    **/
    select?: PlanInvitationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInvitationInclude | null
    /**
     * The data needed to update a PlanInvitation.
     * 
    **/
    data: XOR<PlanInvitationUpdateInput, PlanInvitationUncheckedUpdateInput>
    /**
     * Choose, which PlanInvitation to update.
     * 
    **/
    where: PlanInvitationWhereUniqueInput
  }


  /**
   * PlanInvitation updateMany
   */
  export type PlanInvitationUpdateManyArgs = {
    /**
     * The data used to update PlanInvitations.
     * 
    **/
    data: XOR<PlanInvitationUpdateManyMutationInput, PlanInvitationUncheckedUpdateManyInput>
    /**
     * Filter which PlanInvitations to update
     * 
    **/
    where?: PlanInvitationWhereInput
  }


  /**
   * PlanInvitation upsert
   */
  export type PlanInvitationUpsertArgs = {
    /**
     * Select specific fields to fetch from the PlanInvitation
     * 
    **/
    select?: PlanInvitationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInvitationInclude | null
    /**
     * The filter to search for the PlanInvitation to update in case it exists.
     * 
    **/
    where: PlanInvitationWhereUniqueInput
    /**
     * In case the PlanInvitation found by the `where` argument doesn't exist, create a new PlanInvitation with this data.
     * 
    **/
    create: XOR<PlanInvitationCreateInput, PlanInvitationUncheckedCreateInput>
    /**
     * In case the PlanInvitation was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<PlanInvitationUpdateInput, PlanInvitationUncheckedUpdateInput>
  }


  /**
   * PlanInvitation delete
   */
  export type PlanInvitationDeleteArgs = {
    /**
     * Select specific fields to fetch from the PlanInvitation
     * 
    **/
    select?: PlanInvitationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInvitationInclude | null
    /**
     * Filter which PlanInvitation to delete.
     * 
    **/
    where: PlanInvitationWhereUniqueInput
  }


  /**
   * PlanInvitation deleteMany
   */
  export type PlanInvitationDeleteManyArgs = {
    /**
     * Filter which PlanInvitations to delete
     * 
    **/
    where?: PlanInvitationWhereInput
  }


  /**
   * PlanInvitation: findUniqueOrThrow
   */
  export type PlanInvitationFindUniqueOrThrowArgs = PlanInvitationFindUniqueArgsBase
      

  /**
   * PlanInvitation: findFirstOrThrow
   */
  export type PlanInvitationFindFirstOrThrowArgs = PlanInvitationFindFirstArgsBase
      

  /**
   * PlanInvitation without action
   */
  export type PlanInvitationArgs = {
    /**
     * Select specific fields to fetch from the PlanInvitation
     * 
    **/
    select?: PlanInvitationSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: PlanInvitationInclude | null
  }



  /**
   * Model DefaultCategory
   */


  export type AggregateDefaultCategory = {
    _count: DefaultCategoryCountAggregateOutputType | null
    _min: DefaultCategoryMinAggregateOutputType | null
    _max: DefaultCategoryMaxAggregateOutputType | null
  }

  export type DefaultCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type DefaultCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type DefaultCategoryCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type DefaultCategoryMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type DefaultCategoryMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type DefaultCategoryCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type DefaultCategoryAggregateArgs = {
    /**
     * Filter which DefaultCategory to aggregate.
     * 
    **/
    where?: DefaultCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DefaultCategories to fetch.
     * 
    **/
    orderBy?: Enumerable<DefaultCategoryOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: DefaultCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DefaultCategories from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DefaultCategories.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DefaultCategories
    **/
    _count?: true | DefaultCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DefaultCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DefaultCategoryMaxAggregateInputType
  }

  export type GetDefaultCategoryAggregateType<T extends DefaultCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateDefaultCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDefaultCategory[P]>
      : GetScalarType<T[P], AggregateDefaultCategory[P]>
  }




  export type DefaultCategoryGroupByArgs = {
    where?: DefaultCategoryWhereInput
    orderBy?: Enumerable<DefaultCategoryOrderByWithAggregationInput>
    by: Array<DefaultCategoryScalarFieldEnum>
    having?: DefaultCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DefaultCategoryCountAggregateInputType | true
    _min?: DefaultCategoryMinAggregateInputType
    _max?: DefaultCategoryMaxAggregateInputType
  }


  export type DefaultCategoryGroupByOutputType = {
    id: string
    name: string
    _count: DefaultCategoryCountAggregateOutputType | null
    _min: DefaultCategoryMinAggregateOutputType | null
    _max: DefaultCategoryMaxAggregateOutputType | null
  }

  type GetDefaultCategoryGroupByPayload<T extends DefaultCategoryGroupByArgs> = PrismaPromise<
    Array<
      PickArray<DefaultCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DefaultCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DefaultCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], DefaultCategoryGroupByOutputType[P]>
        }
      >
    >


  export type DefaultCategorySelect = {
    id?: boolean
    name?: boolean
    foodAssignments?: boolean | DefaultFoodCategoryAssignmentFindManyArgs
    _count?: boolean | DefaultCategoryCountOutputTypeArgs
  }

  export type DefaultCategoryInclude = {
    foodAssignments?: boolean | DefaultFoodCategoryAssignmentFindManyArgs
    _count?: boolean | DefaultCategoryCountOutputTypeArgs
  }

  export type DefaultCategoryGetPayload<
    S extends boolean | null | undefined | DefaultCategoryArgs,
    U = keyof S
      > = S extends true
        ? DefaultCategory
    : S extends undefined
    ? never
    : S extends DefaultCategoryArgs | DefaultCategoryFindManyArgs
    ?'include' extends U
    ? DefaultCategory  & {
    [P in TrueKeys<S['include']>]:
        P extends 'foodAssignments' ? Array < DefaultFoodCategoryAssignmentGetPayload<Exclude<S['include'], undefined | null>[P]>>  :
        P extends '_count' ? DefaultCategoryCountOutputTypeGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'foodAssignments' ? Array < DefaultFoodCategoryAssignmentGetPayload<Exclude<S['select'], undefined | null>[P]>>  :
        P extends '_count' ? DefaultCategoryCountOutputTypeGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof DefaultCategory ? DefaultCategory[P] : never
  } 
    : DefaultCategory
  : DefaultCategory


  type DefaultCategoryCountArgs = Merge<
    Omit<DefaultCategoryFindManyArgs, 'select' | 'include'> & {
      select?: DefaultCategoryCountAggregateInputType | true
    }
  >

  export interface DefaultCategoryDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one DefaultCategory that matches the filter.
     * @param {DefaultCategoryFindUniqueArgs} args - Arguments to find a DefaultCategory
     * @example
     * // Get one DefaultCategory
     * const defaultCategory = await prisma.defaultCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DefaultCategoryFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, DefaultCategoryFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'DefaultCategory'> extends True ? CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory>, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T>>> : CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory | null >, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T> | null >>

    /**
     * Find the first DefaultCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultCategoryFindFirstArgs} args - Arguments to find a DefaultCategory
     * @example
     * // Get one DefaultCategory
     * const defaultCategory = await prisma.defaultCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DefaultCategoryFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, DefaultCategoryFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'DefaultCategory'> extends True ? CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory>, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T>>> : CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory | null >, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T> | null >>

    /**
     * Find zero or more DefaultCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultCategoryFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DefaultCategories
     * const defaultCategories = await prisma.defaultCategory.findMany()
     * 
     * // Get first 10 DefaultCategories
     * const defaultCategories = await prisma.defaultCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const defaultCategoryWithIdOnly = await prisma.defaultCategory.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DefaultCategoryFindManyArgs>(
      args?: SelectSubset<T, DefaultCategoryFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<DefaultCategory>>, PrismaPromise<Array<DefaultCategoryGetPayload<T>>>>

    /**
     * Create a DefaultCategory.
     * @param {DefaultCategoryCreateArgs} args - Arguments to create a DefaultCategory.
     * @example
     * // Create one DefaultCategory
     * const DefaultCategory = await prisma.defaultCategory.create({
     *   data: {
     *     // ... data to create a DefaultCategory
     *   }
     * })
     * 
    **/
    create<T extends DefaultCategoryCreateArgs>(
      args: SelectSubset<T, DefaultCategoryCreateArgs>
    ): CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory>, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T>>>

    /**
     * Delete a DefaultCategory.
     * @param {DefaultCategoryDeleteArgs} args - Arguments to delete one DefaultCategory.
     * @example
     * // Delete one DefaultCategory
     * const DefaultCategory = await prisma.defaultCategory.delete({
     *   where: {
     *     // ... filter to delete one DefaultCategory
     *   }
     * })
     * 
    **/
    delete<T extends DefaultCategoryDeleteArgs>(
      args: SelectSubset<T, DefaultCategoryDeleteArgs>
    ): CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory>, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T>>>

    /**
     * Update one DefaultCategory.
     * @param {DefaultCategoryUpdateArgs} args - Arguments to update one DefaultCategory.
     * @example
     * // Update one DefaultCategory
     * const defaultCategory = await prisma.defaultCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DefaultCategoryUpdateArgs>(
      args: SelectSubset<T, DefaultCategoryUpdateArgs>
    ): CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory>, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T>>>

    /**
     * Delete zero or more DefaultCategories.
     * @param {DefaultCategoryDeleteManyArgs} args - Arguments to filter DefaultCategories to delete.
     * @example
     * // Delete a few DefaultCategories
     * const { count } = await prisma.defaultCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DefaultCategoryDeleteManyArgs>(
      args?: SelectSubset<T, DefaultCategoryDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more DefaultCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DefaultCategories
     * const defaultCategory = await prisma.defaultCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DefaultCategoryUpdateManyArgs>(
      args: SelectSubset<T, DefaultCategoryUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one DefaultCategory.
     * @param {DefaultCategoryUpsertArgs} args - Arguments to update or create a DefaultCategory.
     * @example
     * // Update or create a DefaultCategory
     * const defaultCategory = await prisma.defaultCategory.upsert({
     *   create: {
     *     // ... data to create a DefaultCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DefaultCategory we want to update
     *   }
     * })
    **/
    upsert<T extends DefaultCategoryUpsertArgs>(
      args: SelectSubset<T, DefaultCategoryUpsertArgs>
    ): CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory>, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T>>>

    /**
     * Find one DefaultCategory that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {DefaultCategoryFindUniqueOrThrowArgs} args - Arguments to find a DefaultCategory
     * @example
     * // Get one DefaultCategory
     * const defaultCategory = await prisma.defaultCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DefaultCategoryFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, DefaultCategoryFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory>, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T>>>

    /**
     * Find the first DefaultCategory that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultCategoryFindFirstOrThrowArgs} args - Arguments to find a DefaultCategory
     * @example
     * // Get one DefaultCategory
     * const defaultCategory = await prisma.defaultCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DefaultCategoryFindFirstOrThrowArgs>(
      args?: SelectSubset<T, DefaultCategoryFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory>, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T>>>

    /**
     * Count the number of DefaultCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultCategoryCountArgs} args - Arguments to filter DefaultCategories to count.
     * @example
     * // Count the number of DefaultCategories
     * const count = await prisma.defaultCategory.count({
     *   where: {
     *     // ... the filter for the DefaultCategories we want to count
     *   }
     * })
    **/
    count<T extends DefaultCategoryCountArgs>(
      args?: Subset<T, DefaultCategoryCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DefaultCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DefaultCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DefaultCategoryAggregateArgs>(args: Subset<T, DefaultCategoryAggregateArgs>): PrismaPromise<GetDefaultCategoryAggregateType<T>>

    /**
     * Group by DefaultCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DefaultCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DefaultCategoryGroupByArgs['orderBy'] }
        : { orderBy?: DefaultCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DefaultCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDefaultCategoryGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for DefaultCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__DefaultCategoryClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    foodAssignments<T extends DefaultFoodCategoryAssignmentFindManyArgs = {}>(args?: Subset<T, DefaultFoodCategoryAssignmentFindManyArgs>): CheckSelect<T, PrismaPromise<Array<DefaultFoodCategoryAssignment>>, PrismaPromise<Array<DefaultFoodCategoryAssignmentGetPayload<T>>>>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * DefaultCategory base type for findUnique actions
   */
  export type DefaultCategoryFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the DefaultCategory
     * 
    **/
    select?: DefaultCategorySelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultCategoryInclude | null
    /**
     * Filter, which DefaultCategory to fetch.
     * 
    **/
    where: DefaultCategoryWhereUniqueInput
  }

  /**
   * DefaultCategory: findUnique
   */
  export interface DefaultCategoryFindUniqueArgs extends DefaultCategoryFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * DefaultCategory base type for findFirst actions
   */
  export type DefaultCategoryFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the DefaultCategory
     * 
    **/
    select?: DefaultCategorySelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultCategoryInclude | null
    /**
     * Filter, which DefaultCategory to fetch.
     * 
    **/
    where?: DefaultCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DefaultCategories to fetch.
     * 
    **/
    orderBy?: Enumerable<DefaultCategoryOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DefaultCategories.
     * 
    **/
    cursor?: DefaultCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DefaultCategories from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DefaultCategories.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DefaultCategories.
     * 
    **/
    distinct?: Enumerable<DefaultCategoryScalarFieldEnum>
  }

  /**
   * DefaultCategory: findFirst
   */
  export interface DefaultCategoryFindFirstArgs extends DefaultCategoryFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * DefaultCategory findMany
   */
  export type DefaultCategoryFindManyArgs = {
    /**
     * Select specific fields to fetch from the DefaultCategory
     * 
    **/
    select?: DefaultCategorySelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultCategoryInclude | null
    /**
     * Filter, which DefaultCategories to fetch.
     * 
    **/
    where?: DefaultCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DefaultCategories to fetch.
     * 
    **/
    orderBy?: Enumerable<DefaultCategoryOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DefaultCategories.
     * 
    **/
    cursor?: DefaultCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DefaultCategories from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DefaultCategories.
     * 
    **/
    skip?: number
    distinct?: Enumerable<DefaultCategoryScalarFieldEnum>
  }


  /**
   * DefaultCategory create
   */
  export type DefaultCategoryCreateArgs = {
    /**
     * Select specific fields to fetch from the DefaultCategory
     * 
    **/
    select?: DefaultCategorySelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultCategoryInclude | null
    /**
     * The data needed to create a DefaultCategory.
     * 
    **/
    data: XOR<DefaultCategoryCreateInput, DefaultCategoryUncheckedCreateInput>
  }


  /**
   * DefaultCategory update
   */
  export type DefaultCategoryUpdateArgs = {
    /**
     * Select specific fields to fetch from the DefaultCategory
     * 
    **/
    select?: DefaultCategorySelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultCategoryInclude | null
    /**
     * The data needed to update a DefaultCategory.
     * 
    **/
    data: XOR<DefaultCategoryUpdateInput, DefaultCategoryUncheckedUpdateInput>
    /**
     * Choose, which DefaultCategory to update.
     * 
    **/
    where: DefaultCategoryWhereUniqueInput
  }


  /**
   * DefaultCategory updateMany
   */
  export type DefaultCategoryUpdateManyArgs = {
    /**
     * The data used to update DefaultCategories.
     * 
    **/
    data: XOR<DefaultCategoryUpdateManyMutationInput, DefaultCategoryUncheckedUpdateManyInput>
    /**
     * Filter which DefaultCategories to update
     * 
    **/
    where?: DefaultCategoryWhereInput
  }


  /**
   * DefaultCategory upsert
   */
  export type DefaultCategoryUpsertArgs = {
    /**
     * Select specific fields to fetch from the DefaultCategory
     * 
    **/
    select?: DefaultCategorySelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultCategoryInclude | null
    /**
     * The filter to search for the DefaultCategory to update in case it exists.
     * 
    **/
    where: DefaultCategoryWhereUniqueInput
    /**
     * In case the DefaultCategory found by the `where` argument doesn't exist, create a new DefaultCategory with this data.
     * 
    **/
    create: XOR<DefaultCategoryCreateInput, DefaultCategoryUncheckedCreateInput>
    /**
     * In case the DefaultCategory was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<DefaultCategoryUpdateInput, DefaultCategoryUncheckedUpdateInput>
  }


  /**
   * DefaultCategory delete
   */
  export type DefaultCategoryDeleteArgs = {
    /**
     * Select specific fields to fetch from the DefaultCategory
     * 
    **/
    select?: DefaultCategorySelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultCategoryInclude | null
    /**
     * Filter which DefaultCategory to delete.
     * 
    **/
    where: DefaultCategoryWhereUniqueInput
  }


  /**
   * DefaultCategory deleteMany
   */
  export type DefaultCategoryDeleteManyArgs = {
    /**
     * Filter which DefaultCategories to delete
     * 
    **/
    where?: DefaultCategoryWhereInput
  }


  /**
   * DefaultCategory: findUniqueOrThrow
   */
  export type DefaultCategoryFindUniqueOrThrowArgs = DefaultCategoryFindUniqueArgsBase
      

  /**
   * DefaultCategory: findFirstOrThrow
   */
  export type DefaultCategoryFindFirstOrThrowArgs = DefaultCategoryFindFirstArgsBase
      

  /**
   * DefaultCategory without action
   */
  export type DefaultCategoryArgs = {
    /**
     * Select specific fields to fetch from the DefaultCategory
     * 
    **/
    select?: DefaultCategorySelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultCategoryInclude | null
  }



  /**
   * Model DefaultFoodCategoryAssignment
   */


  export type AggregateDefaultFoodCategoryAssignment = {
    _count: DefaultFoodCategoryAssignmentCountAggregateOutputType | null
    _avg: DefaultFoodCategoryAssignmentAvgAggregateOutputType | null
    _sum: DefaultFoodCategoryAssignmentSumAggregateOutputType | null
    _min: DefaultFoodCategoryAssignmentMinAggregateOutputType | null
    _max: DefaultFoodCategoryAssignmentMaxAggregateOutputType | null
  }

  export type DefaultFoodCategoryAssignmentAvgAggregateOutputType = {
    votes: number | null
  }

  export type DefaultFoodCategoryAssignmentSumAggregateOutputType = {
    votes: number | null
  }

  export type DefaultFoodCategoryAssignmentMinAggregateOutputType = {
    id: string | null
    categoryId: string | null
    foodName: string | null
    votes: number | null
  }

  export type DefaultFoodCategoryAssignmentMaxAggregateOutputType = {
    id: string | null
    categoryId: string | null
    foodName: string | null
    votes: number | null
  }

  export type DefaultFoodCategoryAssignmentCountAggregateOutputType = {
    id: number
    categoryId: number
    foodName: number
    votes: number
    _all: number
  }


  export type DefaultFoodCategoryAssignmentAvgAggregateInputType = {
    votes?: true
  }

  export type DefaultFoodCategoryAssignmentSumAggregateInputType = {
    votes?: true
  }

  export type DefaultFoodCategoryAssignmentMinAggregateInputType = {
    id?: true
    categoryId?: true
    foodName?: true
    votes?: true
  }

  export type DefaultFoodCategoryAssignmentMaxAggregateInputType = {
    id?: true
    categoryId?: true
    foodName?: true
    votes?: true
  }

  export type DefaultFoodCategoryAssignmentCountAggregateInputType = {
    id?: true
    categoryId?: true
    foodName?: true
    votes?: true
    _all?: true
  }

  export type DefaultFoodCategoryAssignmentAggregateArgs = {
    /**
     * Filter which DefaultFoodCategoryAssignment to aggregate.
     * 
    **/
    where?: DefaultFoodCategoryAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DefaultFoodCategoryAssignments to fetch.
     * 
    **/
    orderBy?: Enumerable<DefaultFoodCategoryAssignmentOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     * 
    **/
    cursor?: DefaultFoodCategoryAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DefaultFoodCategoryAssignments from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DefaultFoodCategoryAssignments.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DefaultFoodCategoryAssignments
    **/
    _count?: true | DefaultFoodCategoryAssignmentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DefaultFoodCategoryAssignmentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DefaultFoodCategoryAssignmentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DefaultFoodCategoryAssignmentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DefaultFoodCategoryAssignmentMaxAggregateInputType
  }

  export type GetDefaultFoodCategoryAssignmentAggregateType<T extends DefaultFoodCategoryAssignmentAggregateArgs> = {
        [P in keyof T & keyof AggregateDefaultFoodCategoryAssignment]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDefaultFoodCategoryAssignment[P]>
      : GetScalarType<T[P], AggregateDefaultFoodCategoryAssignment[P]>
  }




  export type DefaultFoodCategoryAssignmentGroupByArgs = {
    where?: DefaultFoodCategoryAssignmentWhereInput
    orderBy?: Enumerable<DefaultFoodCategoryAssignmentOrderByWithAggregationInput>
    by: Array<DefaultFoodCategoryAssignmentScalarFieldEnum>
    having?: DefaultFoodCategoryAssignmentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DefaultFoodCategoryAssignmentCountAggregateInputType | true
    _avg?: DefaultFoodCategoryAssignmentAvgAggregateInputType
    _sum?: DefaultFoodCategoryAssignmentSumAggregateInputType
    _min?: DefaultFoodCategoryAssignmentMinAggregateInputType
    _max?: DefaultFoodCategoryAssignmentMaxAggregateInputType
  }


  export type DefaultFoodCategoryAssignmentGroupByOutputType = {
    id: string
    categoryId: string
    foodName: string
    votes: number
    _count: DefaultFoodCategoryAssignmentCountAggregateOutputType | null
    _avg: DefaultFoodCategoryAssignmentAvgAggregateOutputType | null
    _sum: DefaultFoodCategoryAssignmentSumAggregateOutputType | null
    _min: DefaultFoodCategoryAssignmentMinAggregateOutputType | null
    _max: DefaultFoodCategoryAssignmentMaxAggregateOutputType | null
  }

  type GetDefaultFoodCategoryAssignmentGroupByPayload<T extends DefaultFoodCategoryAssignmentGroupByArgs> = PrismaPromise<
    Array<
      PickArray<DefaultFoodCategoryAssignmentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DefaultFoodCategoryAssignmentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DefaultFoodCategoryAssignmentGroupByOutputType[P]>
            : GetScalarType<T[P], DefaultFoodCategoryAssignmentGroupByOutputType[P]>
        }
      >
    >


  export type DefaultFoodCategoryAssignmentSelect = {
    id?: boolean
    categoryId?: boolean
    category?: boolean | DefaultCategoryArgs
    foodName?: boolean
    votes?: boolean
  }

  export type DefaultFoodCategoryAssignmentInclude = {
    category?: boolean | DefaultCategoryArgs
  }

  export type DefaultFoodCategoryAssignmentGetPayload<
    S extends boolean | null | undefined | DefaultFoodCategoryAssignmentArgs,
    U = keyof S
      > = S extends true
        ? DefaultFoodCategoryAssignment
    : S extends undefined
    ? never
    : S extends DefaultFoodCategoryAssignmentArgs | DefaultFoodCategoryAssignmentFindManyArgs
    ?'include' extends U
    ? DefaultFoodCategoryAssignment  & {
    [P in TrueKeys<S['include']>]:
        P extends 'category' ? DefaultCategoryGetPayload<Exclude<S['include'], undefined | null>[P]> :  never
  } 
    : 'select' extends U
    ? {
    [P in TrueKeys<S['select']>]:
        P extends 'category' ? DefaultCategoryGetPayload<Exclude<S['select'], undefined | null>[P]> :  P extends keyof DefaultFoodCategoryAssignment ? DefaultFoodCategoryAssignment[P] : never
  } 
    : DefaultFoodCategoryAssignment
  : DefaultFoodCategoryAssignment


  type DefaultFoodCategoryAssignmentCountArgs = Merge<
    Omit<DefaultFoodCategoryAssignmentFindManyArgs, 'select' | 'include'> & {
      select?: DefaultFoodCategoryAssignmentCountAggregateInputType | true
    }
  >

  export interface DefaultFoodCategoryAssignmentDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {
    /**
     * Find zero or one DefaultFoodCategoryAssignment that matches the filter.
     * @param {DefaultFoodCategoryAssignmentFindUniqueArgs} args - Arguments to find a DefaultFoodCategoryAssignment
     * @example
     * // Get one DefaultFoodCategoryAssignment
     * const defaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends DefaultFoodCategoryAssignmentFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, DefaultFoodCategoryAssignmentFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'DefaultFoodCategoryAssignment'> extends True ? CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment>, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T>>> : CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment | null >, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T> | null >>

    /**
     * Find the first DefaultFoodCategoryAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultFoodCategoryAssignmentFindFirstArgs} args - Arguments to find a DefaultFoodCategoryAssignment
     * @example
     * // Get one DefaultFoodCategoryAssignment
     * const defaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends DefaultFoodCategoryAssignmentFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, DefaultFoodCategoryAssignmentFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'DefaultFoodCategoryAssignment'> extends True ? CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment>, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T>>> : CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment | null >, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T> | null >>

    /**
     * Find zero or more DefaultFoodCategoryAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultFoodCategoryAssignmentFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DefaultFoodCategoryAssignments
     * const defaultFoodCategoryAssignments = await prisma.defaultFoodCategoryAssignment.findMany()
     * 
     * // Get first 10 DefaultFoodCategoryAssignments
     * const defaultFoodCategoryAssignments = await prisma.defaultFoodCategoryAssignment.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const defaultFoodCategoryAssignmentWithIdOnly = await prisma.defaultFoodCategoryAssignment.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends DefaultFoodCategoryAssignmentFindManyArgs>(
      args?: SelectSubset<T, DefaultFoodCategoryAssignmentFindManyArgs>
    ): CheckSelect<T, PrismaPromise<Array<DefaultFoodCategoryAssignment>>, PrismaPromise<Array<DefaultFoodCategoryAssignmentGetPayload<T>>>>

    /**
     * Create a DefaultFoodCategoryAssignment.
     * @param {DefaultFoodCategoryAssignmentCreateArgs} args - Arguments to create a DefaultFoodCategoryAssignment.
     * @example
     * // Create one DefaultFoodCategoryAssignment
     * const DefaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.create({
     *   data: {
     *     // ... data to create a DefaultFoodCategoryAssignment
     *   }
     * })
     * 
    **/
    create<T extends DefaultFoodCategoryAssignmentCreateArgs>(
      args: SelectSubset<T, DefaultFoodCategoryAssignmentCreateArgs>
    ): CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment>, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T>>>

    /**
     * Delete a DefaultFoodCategoryAssignment.
     * @param {DefaultFoodCategoryAssignmentDeleteArgs} args - Arguments to delete one DefaultFoodCategoryAssignment.
     * @example
     * // Delete one DefaultFoodCategoryAssignment
     * const DefaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.delete({
     *   where: {
     *     // ... filter to delete one DefaultFoodCategoryAssignment
     *   }
     * })
     * 
    **/
    delete<T extends DefaultFoodCategoryAssignmentDeleteArgs>(
      args: SelectSubset<T, DefaultFoodCategoryAssignmentDeleteArgs>
    ): CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment>, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T>>>

    /**
     * Update one DefaultFoodCategoryAssignment.
     * @param {DefaultFoodCategoryAssignmentUpdateArgs} args - Arguments to update one DefaultFoodCategoryAssignment.
     * @example
     * // Update one DefaultFoodCategoryAssignment
     * const defaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends DefaultFoodCategoryAssignmentUpdateArgs>(
      args: SelectSubset<T, DefaultFoodCategoryAssignmentUpdateArgs>
    ): CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment>, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T>>>

    /**
     * Delete zero or more DefaultFoodCategoryAssignments.
     * @param {DefaultFoodCategoryAssignmentDeleteManyArgs} args - Arguments to filter DefaultFoodCategoryAssignments to delete.
     * @example
     * // Delete a few DefaultFoodCategoryAssignments
     * const { count } = await prisma.defaultFoodCategoryAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends DefaultFoodCategoryAssignmentDeleteManyArgs>(
      args?: SelectSubset<T, DefaultFoodCategoryAssignmentDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more DefaultFoodCategoryAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultFoodCategoryAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DefaultFoodCategoryAssignments
     * const defaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends DefaultFoodCategoryAssignmentUpdateManyArgs>(
      args: SelectSubset<T, DefaultFoodCategoryAssignmentUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one DefaultFoodCategoryAssignment.
     * @param {DefaultFoodCategoryAssignmentUpsertArgs} args - Arguments to update or create a DefaultFoodCategoryAssignment.
     * @example
     * // Update or create a DefaultFoodCategoryAssignment
     * const defaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.upsert({
     *   create: {
     *     // ... data to create a DefaultFoodCategoryAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DefaultFoodCategoryAssignment we want to update
     *   }
     * })
    **/
    upsert<T extends DefaultFoodCategoryAssignmentUpsertArgs>(
      args: SelectSubset<T, DefaultFoodCategoryAssignmentUpsertArgs>
    ): CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment>, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T>>>

    /**
     * Find one DefaultFoodCategoryAssignment that matches the filter or throw
     * `NotFoundError` if no matches were found.
     * @param {DefaultFoodCategoryAssignmentFindUniqueOrThrowArgs} args - Arguments to find a DefaultFoodCategoryAssignment
     * @example
     * // Get one DefaultFoodCategoryAssignment
     * const defaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends DefaultFoodCategoryAssignmentFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, DefaultFoodCategoryAssignmentFindUniqueOrThrowArgs>
    ): CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment>, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T>>>

    /**
     * Find the first DefaultFoodCategoryAssignment that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultFoodCategoryAssignmentFindFirstOrThrowArgs} args - Arguments to find a DefaultFoodCategoryAssignment
     * @example
     * // Get one DefaultFoodCategoryAssignment
     * const defaultFoodCategoryAssignment = await prisma.defaultFoodCategoryAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends DefaultFoodCategoryAssignmentFindFirstOrThrowArgs>(
      args?: SelectSubset<T, DefaultFoodCategoryAssignmentFindFirstOrThrowArgs>
    ): CheckSelect<T, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignment>, Prisma__DefaultFoodCategoryAssignmentClient<DefaultFoodCategoryAssignmentGetPayload<T>>>

    /**
     * Count the number of DefaultFoodCategoryAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultFoodCategoryAssignmentCountArgs} args - Arguments to filter DefaultFoodCategoryAssignments to count.
     * @example
     * // Count the number of DefaultFoodCategoryAssignments
     * const count = await prisma.defaultFoodCategoryAssignment.count({
     *   where: {
     *     // ... the filter for the DefaultFoodCategoryAssignments we want to count
     *   }
     * })
    **/
    count<T extends DefaultFoodCategoryAssignmentCountArgs>(
      args?: Subset<T, DefaultFoodCategoryAssignmentCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DefaultFoodCategoryAssignmentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DefaultFoodCategoryAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultFoodCategoryAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DefaultFoodCategoryAssignmentAggregateArgs>(args: Subset<T, DefaultFoodCategoryAssignmentAggregateArgs>): PrismaPromise<GetDefaultFoodCategoryAssignmentAggregateType<T>>

    /**
     * Group by DefaultFoodCategoryAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DefaultFoodCategoryAssignmentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DefaultFoodCategoryAssignmentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DefaultFoodCategoryAssignmentGroupByArgs['orderBy'] }
        : { orderBy?: DefaultFoodCategoryAssignmentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DefaultFoodCategoryAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDefaultFoodCategoryAssignmentGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for DefaultFoodCategoryAssignment.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__DefaultFoodCategoryAssignmentClient<T> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    category<T extends DefaultCategoryArgs = {}>(args?: Subset<T, DefaultCategoryArgs>): CheckSelect<T, Prisma__DefaultCategoryClient<DefaultCategory | null >, Prisma__DefaultCategoryClient<DefaultCategoryGetPayload<T> | null >>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * DefaultFoodCategoryAssignment base type for findUnique actions
   */
  export type DefaultFoodCategoryAssignmentFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the DefaultFoodCategoryAssignment
     * 
    **/
    select?: DefaultFoodCategoryAssignmentSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultFoodCategoryAssignmentInclude | null
    /**
     * Filter, which DefaultFoodCategoryAssignment to fetch.
     * 
    **/
    where: DefaultFoodCategoryAssignmentWhereUniqueInput
  }

  /**
   * DefaultFoodCategoryAssignment: findUnique
   */
  export interface DefaultFoodCategoryAssignmentFindUniqueArgs extends DefaultFoodCategoryAssignmentFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * DefaultFoodCategoryAssignment base type for findFirst actions
   */
  export type DefaultFoodCategoryAssignmentFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the DefaultFoodCategoryAssignment
     * 
    **/
    select?: DefaultFoodCategoryAssignmentSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultFoodCategoryAssignmentInclude | null
    /**
     * Filter, which DefaultFoodCategoryAssignment to fetch.
     * 
    **/
    where?: DefaultFoodCategoryAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DefaultFoodCategoryAssignments to fetch.
     * 
    **/
    orderBy?: Enumerable<DefaultFoodCategoryAssignmentOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DefaultFoodCategoryAssignments.
     * 
    **/
    cursor?: DefaultFoodCategoryAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DefaultFoodCategoryAssignments from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DefaultFoodCategoryAssignments.
     * 
    **/
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DefaultFoodCategoryAssignments.
     * 
    **/
    distinct?: Enumerable<DefaultFoodCategoryAssignmentScalarFieldEnum>
  }

  /**
   * DefaultFoodCategoryAssignment: findFirst
   */
  export interface DefaultFoodCategoryAssignmentFindFirstArgs extends DefaultFoodCategoryAssignmentFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * DefaultFoodCategoryAssignment findMany
   */
  export type DefaultFoodCategoryAssignmentFindManyArgs = {
    /**
     * Select specific fields to fetch from the DefaultFoodCategoryAssignment
     * 
    **/
    select?: DefaultFoodCategoryAssignmentSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultFoodCategoryAssignmentInclude | null
    /**
     * Filter, which DefaultFoodCategoryAssignments to fetch.
     * 
    **/
    where?: DefaultFoodCategoryAssignmentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DefaultFoodCategoryAssignments to fetch.
     * 
    **/
    orderBy?: Enumerable<DefaultFoodCategoryAssignmentOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DefaultFoodCategoryAssignments.
     * 
    **/
    cursor?: DefaultFoodCategoryAssignmentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DefaultFoodCategoryAssignments from the position of the cursor.
     * 
    **/
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DefaultFoodCategoryAssignments.
     * 
    **/
    skip?: number
    distinct?: Enumerable<DefaultFoodCategoryAssignmentScalarFieldEnum>
  }


  /**
   * DefaultFoodCategoryAssignment create
   */
  export type DefaultFoodCategoryAssignmentCreateArgs = {
    /**
     * Select specific fields to fetch from the DefaultFoodCategoryAssignment
     * 
    **/
    select?: DefaultFoodCategoryAssignmentSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultFoodCategoryAssignmentInclude | null
    /**
     * The data needed to create a DefaultFoodCategoryAssignment.
     * 
    **/
    data: XOR<DefaultFoodCategoryAssignmentCreateInput, DefaultFoodCategoryAssignmentUncheckedCreateInput>
  }


  /**
   * DefaultFoodCategoryAssignment update
   */
  export type DefaultFoodCategoryAssignmentUpdateArgs = {
    /**
     * Select specific fields to fetch from the DefaultFoodCategoryAssignment
     * 
    **/
    select?: DefaultFoodCategoryAssignmentSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultFoodCategoryAssignmentInclude | null
    /**
     * The data needed to update a DefaultFoodCategoryAssignment.
     * 
    **/
    data: XOR<DefaultFoodCategoryAssignmentUpdateInput, DefaultFoodCategoryAssignmentUncheckedUpdateInput>
    /**
     * Choose, which DefaultFoodCategoryAssignment to update.
     * 
    **/
    where: DefaultFoodCategoryAssignmentWhereUniqueInput
  }


  /**
   * DefaultFoodCategoryAssignment updateMany
   */
  export type DefaultFoodCategoryAssignmentUpdateManyArgs = {
    /**
     * The data used to update DefaultFoodCategoryAssignments.
     * 
    **/
    data: XOR<DefaultFoodCategoryAssignmentUpdateManyMutationInput, DefaultFoodCategoryAssignmentUncheckedUpdateManyInput>
    /**
     * Filter which DefaultFoodCategoryAssignments to update
     * 
    **/
    where?: DefaultFoodCategoryAssignmentWhereInput
  }


  /**
   * DefaultFoodCategoryAssignment upsert
   */
  export type DefaultFoodCategoryAssignmentUpsertArgs = {
    /**
     * Select specific fields to fetch from the DefaultFoodCategoryAssignment
     * 
    **/
    select?: DefaultFoodCategoryAssignmentSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultFoodCategoryAssignmentInclude | null
    /**
     * The filter to search for the DefaultFoodCategoryAssignment to update in case it exists.
     * 
    **/
    where: DefaultFoodCategoryAssignmentWhereUniqueInput
    /**
     * In case the DefaultFoodCategoryAssignment found by the `where` argument doesn't exist, create a new DefaultFoodCategoryAssignment with this data.
     * 
    **/
    create: XOR<DefaultFoodCategoryAssignmentCreateInput, DefaultFoodCategoryAssignmentUncheckedCreateInput>
    /**
     * In case the DefaultFoodCategoryAssignment was found with the provided `where` argument, update it with this data.
     * 
    **/
    update: XOR<DefaultFoodCategoryAssignmentUpdateInput, DefaultFoodCategoryAssignmentUncheckedUpdateInput>
  }


  /**
   * DefaultFoodCategoryAssignment delete
   */
  export type DefaultFoodCategoryAssignmentDeleteArgs = {
    /**
     * Select specific fields to fetch from the DefaultFoodCategoryAssignment
     * 
    **/
    select?: DefaultFoodCategoryAssignmentSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultFoodCategoryAssignmentInclude | null
    /**
     * Filter which DefaultFoodCategoryAssignment to delete.
     * 
    **/
    where: DefaultFoodCategoryAssignmentWhereUniqueInput
  }


  /**
   * DefaultFoodCategoryAssignment deleteMany
   */
  export type DefaultFoodCategoryAssignmentDeleteManyArgs = {
    /**
     * Filter which DefaultFoodCategoryAssignments to delete
     * 
    **/
    where?: DefaultFoodCategoryAssignmentWhereInput
  }


  /**
   * DefaultFoodCategoryAssignment: findUniqueOrThrow
   */
  export type DefaultFoodCategoryAssignmentFindUniqueOrThrowArgs = DefaultFoodCategoryAssignmentFindUniqueArgsBase
      

  /**
   * DefaultFoodCategoryAssignment: findFirstOrThrow
   */
  export type DefaultFoodCategoryAssignmentFindFirstOrThrowArgs = DefaultFoodCategoryAssignmentFindFirstArgsBase
      

  /**
   * DefaultFoodCategoryAssignment without action
   */
  export type DefaultFoodCategoryAssignmentArgs = {
    /**
     * Select specific fields to fetch from the DefaultFoodCategoryAssignment
     * 
    **/
    select?: DefaultFoodCategoryAssignmentSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     * 
    **/
    include?: DefaultFoodCategoryAssignmentInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const AccountScalarFieldEnum: {
    id: 'id',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    type: 'type',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    tokenType: 'tokenType',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    profileId: 'profileId'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const DefaultCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type DefaultCategoryScalarFieldEnum = (typeof DefaultCategoryScalarFieldEnum)[keyof typeof DefaultCategoryScalarFieldEnum]


  export const DefaultFoodCategoryAssignmentScalarFieldEnum: {
    id: 'id',
    categoryId: 'categoryId',
    foodName: 'foodName',
    votes: 'votes'
  };

  export type DefaultFoodCategoryAssignmentScalarFieldEnum = (typeof DefaultFoodCategoryAssignmentScalarFieldEnum)[keyof typeof DefaultFoodCategoryAssignmentScalarFieldEnum]


  export const PlanInvitationScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    expiresAt: 'expiresAt',
    claimedAt: 'claimedAt',
    inviterName: 'inviterName',
    inviterId: 'inviterId',
    planId: 'planId'
  };

  export type PlanInvitationScalarFieldEnum = (typeof PlanInvitationScalarFieldEnum)[keyof typeof PlanInvitationScalarFieldEnum]


  export const PlanScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt',
    stripeCustomerId: 'stripeCustomerId',
    stripeSubscriptionId: 'stripeSubscriptionId',
    subscriptionExpiresAt: 'subscriptionExpiresAt',
    subscriptionCanceledAt: 'subscriptionCanceledAt',
    subscriptionStatus: 'subscriptionStatus'
  };

  export type PlanScalarFieldEnum = (typeof PlanScalarFieldEnum)[keyof typeof PlanScalarFieldEnum]


  export const ProfileScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    friendlyName: 'friendlyName',
    email: 'email',
    imageUrl: 'imageUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    planId: 'planId',
    isProductAdmin: 'isProductAdmin'
  };

  export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  /**
   * Deep Input Types
   */


  export type ProfileWhereInput = {
    AND?: Enumerable<ProfileWhereInput>
    OR?: Enumerable<ProfileWhereInput>
    NOT?: Enumerable<ProfileWhereInput>
    id?: StringFilter | string
    fullName?: StringFilter | string
    friendlyName?: StringFilter | string
    email?: StringFilter | string
    imageUrl?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    planId?: StringFilter | string
    plan?: XOR<PlanRelationFilter, PlanWhereInput>
    invitations?: PlanInvitationListRelationFilter
    accounts?: AccountListRelationFilter
    isProductAdmin?: BoolFilter | boolean
  }

  export type ProfileOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    friendlyName?: SortOrder
    email?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    planId?: SortOrder
    plan?: PlanOrderByWithRelationInput
    invitations?: PlanInvitationOrderByRelationAggregateInput
    accounts?: AccountOrderByRelationAggregateInput
    isProductAdmin?: SortOrder
  }

  export type ProfileWhereUniqueInput = {
    id?: string
    email?: string
  }

  export type ProfileOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    friendlyName?: SortOrder
    email?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    planId?: SortOrder
    isProductAdmin?: SortOrder
    _count?: ProfileCountOrderByAggregateInput
    _max?: ProfileMaxOrderByAggregateInput
    _min?: ProfileMinOrderByAggregateInput
  }

  export type ProfileScalarWhereWithAggregatesInput = {
    AND?: Enumerable<ProfileScalarWhereWithAggregatesInput>
    OR?: Enumerable<ProfileScalarWhereWithAggregatesInput>
    NOT?: Enumerable<ProfileScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    fullName?: StringWithAggregatesFilter | string
    friendlyName?: StringWithAggregatesFilter | string
    email?: StringWithAggregatesFilter | string
    imageUrl?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    planId?: StringWithAggregatesFilter | string
    isProductAdmin?: BoolWithAggregatesFilter | boolean
  }

  export type AccountWhereInput = {
    AND?: Enumerable<AccountWhereInput>
    OR?: Enumerable<AccountWhereInput>
    NOT?: Enumerable<AccountWhereInput>
    id?: StringFilter | string
    provider?: StringFilter | string
    providerAccountId?: StringFilter | string
    type?: StringFilter | string
    accessToken?: StringNullableFilter | string | null
    refreshToken?: StringNullableFilter | string | null
    tokenType?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    profileId?: StringFilter | string
    profile?: XOR<ProfileRelationFilter, ProfileWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    type?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileId?: SortOrder
    profile?: ProfileOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = {
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
  }

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    type?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileId?: SortOrder
    _count?: AccountCountOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: Enumerable<AccountScalarWhereWithAggregatesInput>
    OR?: Enumerable<AccountScalarWhereWithAggregatesInput>
    NOT?: Enumerable<AccountScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    provider?: StringWithAggregatesFilter | string
    providerAccountId?: StringWithAggregatesFilter | string
    type?: StringWithAggregatesFilter | string
    accessToken?: StringNullableWithAggregatesFilter | string | null
    refreshToken?: StringNullableWithAggregatesFilter | string | null
    tokenType?: StringNullableWithAggregatesFilter | string | null
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    profileId?: StringWithAggregatesFilter | string
  }

  export type PlanWhereInput = {
    AND?: Enumerable<PlanWhereInput>
    OR?: Enumerable<PlanWhereInput>
    NOT?: Enumerable<PlanWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    deletedAt?: DateTimeNullableFilter | Date | string | null
    stripeCustomerId?: StringNullableFilter | string | null
    stripeSubscriptionId?: StringNullableFilter | string | null
    subscriptionExpiresAt?: DateTimeNullableFilter | Date | string | null
    subscriptionCanceledAt?: DateTimeNullableFilter | Date | string | null
    subscriptionStatus?: StringNullableFilter | string | null
    members?: ProfileListRelationFilter
    invitations?: PlanInvitationListRelationFilter
  }

  export type PlanOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    subscriptionExpiresAt?: SortOrder
    subscriptionCanceledAt?: SortOrder
    subscriptionStatus?: SortOrder
    members?: ProfileOrderByRelationAggregateInput
    invitations?: PlanInvitationOrderByRelationAggregateInput
  }

  export type PlanWhereUniqueInput = {
    id?: string
    stripeSubscriptionId?: string
  }

  export type PlanOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    subscriptionExpiresAt?: SortOrder
    subscriptionCanceledAt?: SortOrder
    subscriptionStatus?: SortOrder
    _count?: PlanCountOrderByAggregateInput
    _max?: PlanMaxOrderByAggregateInput
    _min?: PlanMinOrderByAggregateInput
  }

  export type PlanScalarWhereWithAggregatesInput = {
    AND?: Enumerable<PlanScalarWhereWithAggregatesInput>
    OR?: Enumerable<PlanScalarWhereWithAggregatesInput>
    NOT?: Enumerable<PlanScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    stripeCustomerId?: StringNullableWithAggregatesFilter | string | null
    stripeSubscriptionId?: StringNullableWithAggregatesFilter | string | null
    subscriptionExpiresAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    subscriptionCanceledAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    subscriptionStatus?: StringNullableWithAggregatesFilter | string | null
  }

  export type PlanInvitationWhereInput = {
    AND?: Enumerable<PlanInvitationWhereInput>
    OR?: Enumerable<PlanInvitationWhereInput>
    NOT?: Enumerable<PlanInvitationWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    expiresAt?: DateTimeFilter | Date | string
    claimedAt?: DateTimeNullableFilter | Date | string | null
    inviterName?: StringFilter | string
    inviterId?: StringFilter | string
    inviter?: XOR<ProfileRelationFilter, ProfileWhereInput>
    planId?: StringFilter | string
    plan?: XOR<PlanRelationFilter, PlanWhereInput>
  }

  export type PlanInvitationOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    claimedAt?: SortOrder
    inviterName?: SortOrder
    inviterId?: SortOrder
    inviter?: ProfileOrderByWithRelationInput
    planId?: SortOrder
    plan?: PlanOrderByWithRelationInput
  }

  export type PlanInvitationWhereUniqueInput = {
    id?: string
  }

  export type PlanInvitationOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    claimedAt?: SortOrder
    inviterName?: SortOrder
    inviterId?: SortOrder
    planId?: SortOrder
    _count?: PlanInvitationCountOrderByAggregateInput
    _max?: PlanInvitationMaxOrderByAggregateInput
    _min?: PlanInvitationMinOrderByAggregateInput
  }

  export type PlanInvitationScalarWhereWithAggregatesInput = {
    AND?: Enumerable<PlanInvitationScalarWhereWithAggregatesInput>
    OR?: Enumerable<PlanInvitationScalarWhereWithAggregatesInput>
    NOT?: Enumerable<PlanInvitationScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    createdAt?: DateTimeWithAggregatesFilter | Date | string
    updatedAt?: DateTimeWithAggregatesFilter | Date | string
    expiresAt?: DateTimeWithAggregatesFilter | Date | string
    claimedAt?: DateTimeNullableWithAggregatesFilter | Date | string | null
    inviterName?: StringWithAggregatesFilter | string
    inviterId?: StringWithAggregatesFilter | string
    planId?: StringWithAggregatesFilter | string
  }

  export type DefaultCategoryWhereInput = {
    AND?: Enumerable<DefaultCategoryWhereInput>
    OR?: Enumerable<DefaultCategoryWhereInput>
    NOT?: Enumerable<DefaultCategoryWhereInput>
    id?: StringFilter | string
    name?: StringFilter | string
    foodAssignments?: DefaultFoodCategoryAssignmentListRelationFilter
  }

  export type DefaultCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    foodAssignments?: DefaultFoodCategoryAssignmentOrderByRelationAggregateInput
  }

  export type DefaultCategoryWhereUniqueInput = {
    id?: string
  }

  export type DefaultCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: DefaultCategoryCountOrderByAggregateInput
    _max?: DefaultCategoryMaxOrderByAggregateInput
    _min?: DefaultCategoryMinOrderByAggregateInput
  }

  export type DefaultCategoryScalarWhereWithAggregatesInput = {
    AND?: Enumerable<DefaultCategoryScalarWhereWithAggregatesInput>
    OR?: Enumerable<DefaultCategoryScalarWhereWithAggregatesInput>
    NOT?: Enumerable<DefaultCategoryScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    name?: StringWithAggregatesFilter | string
  }

  export type DefaultFoodCategoryAssignmentWhereInput = {
    AND?: Enumerable<DefaultFoodCategoryAssignmentWhereInput>
    OR?: Enumerable<DefaultFoodCategoryAssignmentWhereInput>
    NOT?: Enumerable<DefaultFoodCategoryAssignmentWhereInput>
    id?: StringFilter | string
    categoryId?: StringFilter | string
    category?: XOR<DefaultCategoryRelationFilter, DefaultCategoryWhereInput>
    foodName?: StringFilter | string
    votes?: IntFilter | number
  }

  export type DefaultFoodCategoryAssignmentOrderByWithRelationInput = {
    id?: SortOrder
    categoryId?: SortOrder
    category?: DefaultCategoryOrderByWithRelationInput
    foodName?: SortOrder
    votes?: SortOrder
  }

  export type DefaultFoodCategoryAssignmentWhereUniqueInput = {
    id?: string
    categoryId_foodName?: DefaultFoodCategoryAssignmentCategoryIdFoodNameCompoundUniqueInput
  }

  export type DefaultFoodCategoryAssignmentOrderByWithAggregationInput = {
    id?: SortOrder
    categoryId?: SortOrder
    foodName?: SortOrder
    votes?: SortOrder
    _count?: DefaultFoodCategoryAssignmentCountOrderByAggregateInput
    _avg?: DefaultFoodCategoryAssignmentAvgOrderByAggregateInput
    _max?: DefaultFoodCategoryAssignmentMaxOrderByAggregateInput
    _min?: DefaultFoodCategoryAssignmentMinOrderByAggregateInput
    _sum?: DefaultFoodCategoryAssignmentSumOrderByAggregateInput
  }

  export type DefaultFoodCategoryAssignmentScalarWhereWithAggregatesInput = {
    AND?: Enumerable<DefaultFoodCategoryAssignmentScalarWhereWithAggregatesInput>
    OR?: Enumerable<DefaultFoodCategoryAssignmentScalarWhereWithAggregatesInput>
    NOT?: Enumerable<DefaultFoodCategoryAssignmentScalarWhereWithAggregatesInput>
    id?: StringWithAggregatesFilter | string
    categoryId?: StringWithAggregatesFilter | string
    foodName?: StringWithAggregatesFilter | string
    votes?: IntWithAggregatesFilter | number
  }

  export type ProfileCreateInput = {
    id?: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutMembersInput
    invitations?: PlanInvitationCreateNestedManyWithoutInviterInput
    accounts?: AccountCreateNestedManyWithoutProfileInput
    isProductAdmin?: boolean
  }

  export type ProfileUncheckedCreateInput = {
    id?: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    planId: string
    invitations?: PlanInvitationUncheckedCreateNestedManyWithoutInviterInput
    accounts?: AccountUncheckedCreateNestedManyWithoutProfileInput
    isProductAdmin?: boolean
  }

  export type ProfileUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutMembersNestedInput
    invitations?: PlanInvitationUpdateManyWithoutInviterNestedInput
    accounts?: AccountUpdateManyWithoutProfileNestedInput
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    planId?: StringFieldUpdateOperationsInput | string
    invitations?: PlanInvitationUncheckedUpdateManyWithoutInviterNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutProfileNestedInput
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    planId?: StringFieldUpdateOperationsInput | string
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AccountCreateInput = {
    id?: string
    provider: string
    providerAccountId: string
    type: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profile: ProfileCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    provider: string
    providerAccountId: string
    type: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    profileId: string
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profile?: ProfileUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    profileId?: StringFieldUpdateOperationsInput | string
  }

  export type PlanCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCanceledAt?: Date | string | null
    subscriptionStatus?: string | null
    members?: ProfileCreateNestedManyWithoutPlanInput
    invitations?: PlanInvitationCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCanceledAt?: Date | string | null
    subscriptionStatus?: string | null
    members?: ProfileUncheckedCreateNestedManyWithoutPlanInput
    invitations?: PlanInvitationUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCanceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ProfileUpdateManyWithoutPlanNestedInput
    invitations?: PlanInvitationUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCanceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ProfileUncheckedUpdateManyWithoutPlanNestedInput
    invitations?: PlanInvitationUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCanceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlanUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCanceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PlanInvitationCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    claimedAt?: Date | string | null
    inviterName: string
    inviter: ProfileCreateNestedOneWithoutInvitationsInput
    plan: PlanCreateNestedOneWithoutInvitationsInput
  }

  export type PlanInvitationUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    claimedAt?: Date | string | null
    inviterName: string
    inviterId: string
    planId: string
  }

  export type PlanInvitationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
    inviter?: ProfileUpdateOneRequiredWithoutInvitationsNestedInput
    plan?: PlanUpdateOneRequiredWithoutInvitationsNestedInput
  }

  export type PlanInvitationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
    inviterId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
  }

  export type PlanInvitationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
  }

  export type PlanInvitationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
    inviterId?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
  }

  export type DefaultCategoryCreateInput = {
    id?: string
    name: string
    foodAssignments?: DefaultFoodCategoryAssignmentCreateNestedManyWithoutCategoryInput
  }

  export type DefaultCategoryUncheckedCreateInput = {
    id?: string
    name: string
    foodAssignments?: DefaultFoodCategoryAssignmentUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type DefaultCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    foodAssignments?: DefaultFoodCategoryAssignmentUpdateManyWithoutCategoryNestedInput
  }

  export type DefaultCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    foodAssignments?: DefaultFoodCategoryAssignmentUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type DefaultCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type DefaultCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type DefaultFoodCategoryAssignmentCreateInput = {
    id?: string
    category: DefaultCategoryCreateNestedOneWithoutFoodAssignmentsInput
    foodName: string
    votes?: number
  }

  export type DefaultFoodCategoryAssignmentUncheckedCreateInput = {
    id?: string
    categoryId: string
    foodName: string
    votes?: number
  }

  export type DefaultFoodCategoryAssignmentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: DefaultCategoryUpdateOneRequiredWithoutFoodAssignmentsNestedInput
    foodName?: StringFieldUpdateOperationsInput | string
    votes?: IntFieldUpdateOperationsInput | number
  }

  export type DefaultFoodCategoryAssignmentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    foodName?: StringFieldUpdateOperationsInput | string
    votes?: IntFieldUpdateOperationsInput | number
  }

  export type DefaultFoodCategoryAssignmentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    foodName?: StringFieldUpdateOperationsInput | string
    votes?: IntFieldUpdateOperationsInput | number
  }

  export type DefaultFoodCategoryAssignmentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    foodName?: StringFieldUpdateOperationsInput | string
    votes?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type StringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type PlanRelationFilter = {
    is?: PlanWhereInput
    isNot?: PlanWhereInput
  }

  export type PlanInvitationListRelationFilter = {
    every?: PlanInvitationWhereInput
    some?: PlanInvitationWhereInput
    none?: PlanInvitationWhereInput
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type BoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type PlanInvitationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProfileCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    friendlyName?: SortOrder
    email?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    planId?: SortOrder
    isProductAdmin?: SortOrder
  }

  export type ProfileMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    friendlyName?: SortOrder
    email?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    planId?: SortOrder
    isProductAdmin?: SortOrder
  }

  export type ProfileMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    friendlyName?: SortOrder
    email?: SortOrder
    imageUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    planId?: SortOrder
    isProductAdmin?: SortOrder
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type StringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type BoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type ProfileRelationFilter = {
    is?: ProfileWhereInput
    isNot?: ProfileWhereInput
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    type?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileId?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    type?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileId?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    type?: SortOrder
    accessToken?: SortOrder
    refreshToken?: SortOrder
    tokenType?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    profileId?: SortOrder
  }

  export type DateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type ProfileListRelationFilter = {
    every?: ProfileWhereInput
    some?: ProfileWhereInput
    none?: ProfileWhereInput
  }

  export type ProfileOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PlanCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    subscriptionExpiresAt?: SortOrder
    subscriptionCanceledAt?: SortOrder
    subscriptionStatus?: SortOrder
  }

  export type PlanMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    subscriptionExpiresAt?: SortOrder
    subscriptionCanceledAt?: SortOrder
    subscriptionStatus?: SortOrder
  }

  export type PlanMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
    stripeCustomerId?: SortOrder
    stripeSubscriptionId?: SortOrder
    subscriptionExpiresAt?: SortOrder
    subscriptionCanceledAt?: SortOrder
    subscriptionStatus?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type PlanInvitationCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    claimedAt?: SortOrder
    inviterName?: SortOrder
    inviterId?: SortOrder
    planId?: SortOrder
  }

  export type PlanInvitationMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    claimedAt?: SortOrder
    inviterName?: SortOrder
    inviterId?: SortOrder
    planId?: SortOrder
  }

  export type PlanInvitationMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    expiresAt?: SortOrder
    claimedAt?: SortOrder
    inviterName?: SortOrder
    inviterId?: SortOrder
    planId?: SortOrder
  }

  export type DefaultFoodCategoryAssignmentListRelationFilter = {
    every?: DefaultFoodCategoryAssignmentWhereInput
    some?: DefaultFoodCategoryAssignmentWhereInput
    none?: DefaultFoodCategoryAssignmentWhereInput
  }

  export type DefaultFoodCategoryAssignmentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DefaultCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type DefaultCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type DefaultCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type DefaultCategoryRelationFilter = {
    is?: DefaultCategoryWhereInput
    isNot?: DefaultCategoryWhereInput
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type DefaultFoodCategoryAssignmentCategoryIdFoodNameCompoundUniqueInput = {
    categoryId: string
    foodName: string
  }

  export type DefaultFoodCategoryAssignmentCountOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    foodName?: SortOrder
    votes?: SortOrder
  }

  export type DefaultFoodCategoryAssignmentAvgOrderByAggregateInput = {
    votes?: SortOrder
  }

  export type DefaultFoodCategoryAssignmentMaxOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    foodName?: SortOrder
    votes?: SortOrder
  }

  export type DefaultFoodCategoryAssignmentMinOrderByAggregateInput = {
    id?: SortOrder
    categoryId?: SortOrder
    foodName?: SortOrder
    votes?: SortOrder
  }

  export type DefaultFoodCategoryAssignmentSumOrderByAggregateInput = {
    votes?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type PlanCreateNestedOneWithoutMembersInput = {
    create?: XOR<PlanCreateWithoutMembersInput, PlanUncheckedCreateWithoutMembersInput>
    connectOrCreate?: PlanCreateOrConnectWithoutMembersInput
    connect?: PlanWhereUniqueInput
  }

  export type PlanInvitationCreateNestedManyWithoutInviterInput = {
    create?: XOR<Enumerable<PlanInvitationCreateWithoutInviterInput>, Enumerable<PlanInvitationUncheckedCreateWithoutInviterInput>>
    connectOrCreate?: Enumerable<PlanInvitationCreateOrConnectWithoutInviterInput>
    connect?: Enumerable<PlanInvitationWhereUniqueInput>
  }

  export type AccountCreateNestedManyWithoutProfileInput = {
    create?: XOR<Enumerable<AccountCreateWithoutProfileInput>, Enumerable<AccountUncheckedCreateWithoutProfileInput>>
    connectOrCreate?: Enumerable<AccountCreateOrConnectWithoutProfileInput>
    connect?: Enumerable<AccountWhereUniqueInput>
  }

  export type PlanInvitationUncheckedCreateNestedManyWithoutInviterInput = {
    create?: XOR<Enumerable<PlanInvitationCreateWithoutInviterInput>, Enumerable<PlanInvitationUncheckedCreateWithoutInviterInput>>
    connectOrCreate?: Enumerable<PlanInvitationCreateOrConnectWithoutInviterInput>
    connect?: Enumerable<PlanInvitationWhereUniqueInput>
  }

  export type AccountUncheckedCreateNestedManyWithoutProfileInput = {
    create?: XOR<Enumerable<AccountCreateWithoutProfileInput>, Enumerable<AccountUncheckedCreateWithoutProfileInput>>
    connectOrCreate?: Enumerable<AccountCreateOrConnectWithoutProfileInput>
    connect?: Enumerable<AccountWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PlanUpdateOneRequiredWithoutMembersNestedInput = {
    create?: XOR<PlanCreateWithoutMembersInput, PlanUncheckedCreateWithoutMembersInput>
    connectOrCreate?: PlanCreateOrConnectWithoutMembersInput
    upsert?: PlanUpsertWithoutMembersInput
    connect?: PlanWhereUniqueInput
    update?: XOR<PlanUpdateWithoutMembersInput, PlanUncheckedUpdateWithoutMembersInput>
  }

  export type PlanInvitationUpdateManyWithoutInviterNestedInput = {
    create?: XOR<Enumerable<PlanInvitationCreateWithoutInviterInput>, Enumerable<PlanInvitationUncheckedCreateWithoutInviterInput>>
    connectOrCreate?: Enumerable<PlanInvitationCreateOrConnectWithoutInviterInput>
    upsert?: Enumerable<PlanInvitationUpsertWithWhereUniqueWithoutInviterInput>
    set?: Enumerable<PlanInvitationWhereUniqueInput>
    disconnect?: Enumerable<PlanInvitationWhereUniqueInput>
    delete?: Enumerable<PlanInvitationWhereUniqueInput>
    connect?: Enumerable<PlanInvitationWhereUniqueInput>
    update?: Enumerable<PlanInvitationUpdateWithWhereUniqueWithoutInviterInput>
    updateMany?: Enumerable<PlanInvitationUpdateManyWithWhereWithoutInviterInput>
    deleteMany?: Enumerable<PlanInvitationScalarWhereInput>
  }

  export type AccountUpdateManyWithoutProfileNestedInput = {
    create?: XOR<Enumerable<AccountCreateWithoutProfileInput>, Enumerable<AccountUncheckedCreateWithoutProfileInput>>
    connectOrCreate?: Enumerable<AccountCreateOrConnectWithoutProfileInput>
    upsert?: Enumerable<AccountUpsertWithWhereUniqueWithoutProfileInput>
    set?: Enumerable<AccountWhereUniqueInput>
    disconnect?: Enumerable<AccountWhereUniqueInput>
    delete?: Enumerable<AccountWhereUniqueInput>
    connect?: Enumerable<AccountWhereUniqueInput>
    update?: Enumerable<AccountUpdateWithWhereUniqueWithoutProfileInput>
    updateMany?: Enumerable<AccountUpdateManyWithWhereWithoutProfileInput>
    deleteMany?: Enumerable<AccountScalarWhereInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type PlanInvitationUncheckedUpdateManyWithoutInviterNestedInput = {
    create?: XOR<Enumerable<PlanInvitationCreateWithoutInviterInput>, Enumerable<PlanInvitationUncheckedCreateWithoutInviterInput>>
    connectOrCreate?: Enumerable<PlanInvitationCreateOrConnectWithoutInviterInput>
    upsert?: Enumerable<PlanInvitationUpsertWithWhereUniqueWithoutInviterInput>
    set?: Enumerable<PlanInvitationWhereUniqueInput>
    disconnect?: Enumerable<PlanInvitationWhereUniqueInput>
    delete?: Enumerable<PlanInvitationWhereUniqueInput>
    connect?: Enumerable<PlanInvitationWhereUniqueInput>
    update?: Enumerable<PlanInvitationUpdateWithWhereUniqueWithoutInviterInput>
    updateMany?: Enumerable<PlanInvitationUpdateManyWithWhereWithoutInviterInput>
    deleteMany?: Enumerable<PlanInvitationScalarWhereInput>
  }

  export type AccountUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: XOR<Enumerable<AccountCreateWithoutProfileInput>, Enumerable<AccountUncheckedCreateWithoutProfileInput>>
    connectOrCreate?: Enumerable<AccountCreateOrConnectWithoutProfileInput>
    upsert?: Enumerable<AccountUpsertWithWhereUniqueWithoutProfileInput>
    set?: Enumerable<AccountWhereUniqueInput>
    disconnect?: Enumerable<AccountWhereUniqueInput>
    delete?: Enumerable<AccountWhereUniqueInput>
    connect?: Enumerable<AccountWhereUniqueInput>
    update?: Enumerable<AccountUpdateWithWhereUniqueWithoutProfileInput>
    updateMany?: Enumerable<AccountUpdateManyWithWhereWithoutProfileInput>
    deleteMany?: Enumerable<AccountScalarWhereInput>
  }

  export type ProfileCreateNestedOneWithoutAccountsInput = {
    create?: XOR<ProfileCreateWithoutAccountsInput, ProfileUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountsInput
    connect?: ProfileWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<ProfileCreateWithoutAccountsInput, ProfileUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutAccountsInput
    upsert?: ProfileUpsertWithoutAccountsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<ProfileUpdateWithoutAccountsInput, ProfileUncheckedUpdateWithoutAccountsInput>
  }

  export type ProfileCreateNestedManyWithoutPlanInput = {
    create?: XOR<Enumerable<ProfileCreateWithoutPlanInput>, Enumerable<ProfileUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<ProfileCreateOrConnectWithoutPlanInput>
    connect?: Enumerable<ProfileWhereUniqueInput>
  }

  export type PlanInvitationCreateNestedManyWithoutPlanInput = {
    create?: XOR<Enumerable<PlanInvitationCreateWithoutPlanInput>, Enumerable<PlanInvitationUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<PlanInvitationCreateOrConnectWithoutPlanInput>
    connect?: Enumerable<PlanInvitationWhereUniqueInput>
  }

  export type ProfileUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<Enumerable<ProfileCreateWithoutPlanInput>, Enumerable<ProfileUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<ProfileCreateOrConnectWithoutPlanInput>
    connect?: Enumerable<ProfileWhereUniqueInput>
  }

  export type PlanInvitationUncheckedCreateNestedManyWithoutPlanInput = {
    create?: XOR<Enumerable<PlanInvitationCreateWithoutPlanInput>, Enumerable<PlanInvitationUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<PlanInvitationCreateOrConnectWithoutPlanInput>
    connect?: Enumerable<PlanInvitationWhereUniqueInput>
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type ProfileUpdateManyWithoutPlanNestedInput = {
    create?: XOR<Enumerable<ProfileCreateWithoutPlanInput>, Enumerable<ProfileUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<ProfileCreateOrConnectWithoutPlanInput>
    upsert?: Enumerable<ProfileUpsertWithWhereUniqueWithoutPlanInput>
    set?: Enumerable<ProfileWhereUniqueInput>
    disconnect?: Enumerable<ProfileWhereUniqueInput>
    delete?: Enumerable<ProfileWhereUniqueInput>
    connect?: Enumerable<ProfileWhereUniqueInput>
    update?: Enumerable<ProfileUpdateWithWhereUniqueWithoutPlanInput>
    updateMany?: Enumerable<ProfileUpdateManyWithWhereWithoutPlanInput>
    deleteMany?: Enumerable<ProfileScalarWhereInput>
  }

  export type PlanInvitationUpdateManyWithoutPlanNestedInput = {
    create?: XOR<Enumerable<PlanInvitationCreateWithoutPlanInput>, Enumerable<PlanInvitationUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<PlanInvitationCreateOrConnectWithoutPlanInput>
    upsert?: Enumerable<PlanInvitationUpsertWithWhereUniqueWithoutPlanInput>
    set?: Enumerable<PlanInvitationWhereUniqueInput>
    disconnect?: Enumerable<PlanInvitationWhereUniqueInput>
    delete?: Enumerable<PlanInvitationWhereUniqueInput>
    connect?: Enumerable<PlanInvitationWhereUniqueInput>
    update?: Enumerable<PlanInvitationUpdateWithWhereUniqueWithoutPlanInput>
    updateMany?: Enumerable<PlanInvitationUpdateManyWithWhereWithoutPlanInput>
    deleteMany?: Enumerable<PlanInvitationScalarWhereInput>
  }

  export type ProfileUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<Enumerable<ProfileCreateWithoutPlanInput>, Enumerable<ProfileUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<ProfileCreateOrConnectWithoutPlanInput>
    upsert?: Enumerable<ProfileUpsertWithWhereUniqueWithoutPlanInput>
    set?: Enumerable<ProfileWhereUniqueInput>
    disconnect?: Enumerable<ProfileWhereUniqueInput>
    delete?: Enumerable<ProfileWhereUniqueInput>
    connect?: Enumerable<ProfileWhereUniqueInput>
    update?: Enumerable<ProfileUpdateWithWhereUniqueWithoutPlanInput>
    updateMany?: Enumerable<ProfileUpdateManyWithWhereWithoutPlanInput>
    deleteMany?: Enumerable<ProfileScalarWhereInput>
  }

  export type PlanInvitationUncheckedUpdateManyWithoutPlanNestedInput = {
    create?: XOR<Enumerable<PlanInvitationCreateWithoutPlanInput>, Enumerable<PlanInvitationUncheckedCreateWithoutPlanInput>>
    connectOrCreate?: Enumerable<PlanInvitationCreateOrConnectWithoutPlanInput>
    upsert?: Enumerable<PlanInvitationUpsertWithWhereUniqueWithoutPlanInput>
    set?: Enumerable<PlanInvitationWhereUniqueInput>
    disconnect?: Enumerable<PlanInvitationWhereUniqueInput>
    delete?: Enumerable<PlanInvitationWhereUniqueInput>
    connect?: Enumerable<PlanInvitationWhereUniqueInput>
    update?: Enumerable<PlanInvitationUpdateWithWhereUniqueWithoutPlanInput>
    updateMany?: Enumerable<PlanInvitationUpdateManyWithWhereWithoutPlanInput>
    deleteMany?: Enumerable<PlanInvitationScalarWhereInput>
  }

  export type ProfileCreateNestedOneWithoutInvitationsInput = {
    create?: XOR<ProfileCreateWithoutInvitationsInput, ProfileUncheckedCreateWithoutInvitationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutInvitationsInput
    connect?: ProfileWhereUniqueInput
  }

  export type PlanCreateNestedOneWithoutInvitationsInput = {
    create?: XOR<PlanCreateWithoutInvitationsInput, PlanUncheckedCreateWithoutInvitationsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutInvitationsInput
    connect?: PlanWhereUniqueInput
  }

  export type ProfileUpdateOneRequiredWithoutInvitationsNestedInput = {
    create?: XOR<ProfileCreateWithoutInvitationsInput, ProfileUncheckedCreateWithoutInvitationsInput>
    connectOrCreate?: ProfileCreateOrConnectWithoutInvitationsInput
    upsert?: ProfileUpsertWithoutInvitationsInput
    connect?: ProfileWhereUniqueInput
    update?: XOR<ProfileUpdateWithoutInvitationsInput, ProfileUncheckedUpdateWithoutInvitationsInput>
  }

  export type PlanUpdateOneRequiredWithoutInvitationsNestedInput = {
    create?: XOR<PlanCreateWithoutInvitationsInput, PlanUncheckedCreateWithoutInvitationsInput>
    connectOrCreate?: PlanCreateOrConnectWithoutInvitationsInput
    upsert?: PlanUpsertWithoutInvitationsInput
    connect?: PlanWhereUniqueInput
    update?: XOR<PlanUpdateWithoutInvitationsInput, PlanUncheckedUpdateWithoutInvitationsInput>
  }

  export type DefaultFoodCategoryAssignmentCreateNestedManyWithoutCategoryInput = {
    create?: XOR<Enumerable<DefaultFoodCategoryAssignmentCreateWithoutCategoryInput>, Enumerable<DefaultFoodCategoryAssignmentUncheckedCreateWithoutCategoryInput>>
    connectOrCreate?: Enumerable<DefaultFoodCategoryAssignmentCreateOrConnectWithoutCategoryInput>
    connect?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
  }

  export type DefaultFoodCategoryAssignmentUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<Enumerable<DefaultFoodCategoryAssignmentCreateWithoutCategoryInput>, Enumerable<DefaultFoodCategoryAssignmentUncheckedCreateWithoutCategoryInput>>
    connectOrCreate?: Enumerable<DefaultFoodCategoryAssignmentCreateOrConnectWithoutCategoryInput>
    connect?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
  }

  export type DefaultFoodCategoryAssignmentUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<Enumerable<DefaultFoodCategoryAssignmentCreateWithoutCategoryInput>, Enumerable<DefaultFoodCategoryAssignmentUncheckedCreateWithoutCategoryInput>>
    connectOrCreate?: Enumerable<DefaultFoodCategoryAssignmentCreateOrConnectWithoutCategoryInput>
    upsert?: Enumerable<DefaultFoodCategoryAssignmentUpsertWithWhereUniqueWithoutCategoryInput>
    set?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
    disconnect?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
    delete?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
    connect?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
    update?: Enumerable<DefaultFoodCategoryAssignmentUpdateWithWhereUniqueWithoutCategoryInput>
    updateMany?: Enumerable<DefaultFoodCategoryAssignmentUpdateManyWithWhereWithoutCategoryInput>
    deleteMany?: Enumerable<DefaultFoodCategoryAssignmentScalarWhereInput>
  }

  export type DefaultFoodCategoryAssignmentUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<Enumerable<DefaultFoodCategoryAssignmentCreateWithoutCategoryInput>, Enumerable<DefaultFoodCategoryAssignmentUncheckedCreateWithoutCategoryInput>>
    connectOrCreate?: Enumerable<DefaultFoodCategoryAssignmentCreateOrConnectWithoutCategoryInput>
    upsert?: Enumerable<DefaultFoodCategoryAssignmentUpsertWithWhereUniqueWithoutCategoryInput>
    set?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
    disconnect?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
    delete?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
    connect?: Enumerable<DefaultFoodCategoryAssignmentWhereUniqueInput>
    update?: Enumerable<DefaultFoodCategoryAssignmentUpdateWithWhereUniqueWithoutCategoryInput>
    updateMany?: Enumerable<DefaultFoodCategoryAssignmentUpdateManyWithWhereWithoutCategoryInput>
    deleteMany?: Enumerable<DefaultFoodCategoryAssignmentScalarWhereInput>
  }

  export type DefaultCategoryCreateNestedOneWithoutFoodAssignmentsInput = {
    create?: XOR<DefaultCategoryCreateWithoutFoodAssignmentsInput, DefaultCategoryUncheckedCreateWithoutFoodAssignmentsInput>
    connectOrCreate?: DefaultCategoryCreateOrConnectWithoutFoodAssignmentsInput
    connect?: DefaultCategoryWhereUniqueInput
  }

  export type DefaultCategoryUpdateOneRequiredWithoutFoodAssignmentsNestedInput = {
    create?: XOR<DefaultCategoryCreateWithoutFoodAssignmentsInput, DefaultCategoryUncheckedCreateWithoutFoodAssignmentsInput>
    connectOrCreate?: DefaultCategoryCreateOrConnectWithoutFoodAssignmentsInput
    upsert?: DefaultCategoryUpsertWithoutFoodAssignmentsInput
    connect?: DefaultCategoryWhereUniqueInput
    update?: XOR<DefaultCategoryUpdateWithoutFoodAssignmentsInput, DefaultCategoryUncheckedUpdateWithoutFoodAssignmentsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedStringNullableFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableFilter | string | null
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedBoolFilter = {
    equals?: boolean
    not?: NestedBoolFilter | boolean
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringNullableWithAggregatesFilter = {
    equals?: string | null
    in?: Enumerable<string> | null
    notIn?: Enumerable<string> | null
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringNullableWithAggregatesFilter | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedStringNullableFilter
    _max?: NestedStringNullableFilter
  }

  export type NestedIntNullableFilter = {
    equals?: number | null
    in?: Enumerable<number> | null
    notIn?: Enumerable<number> | null
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntNullableFilter | number | null
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedBoolWithAggregatesFilter = {
    equals?: boolean
    not?: NestedBoolWithAggregatesFilter | boolean
    _count?: NestedIntFilter
    _min?: NestedBoolFilter
    _max?: NestedBoolFilter
  }

  export type NestedDateTimeNullableFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableFilter | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter = {
    equals?: Date | string | null
    in?: Enumerable<Date> | Enumerable<string> | null
    notIn?: Enumerable<Date> | Enumerable<string> | null
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeNullableWithAggregatesFilter | Date | string | null
    _count?: NestedIntNullableFilter
    _min?: NestedDateTimeNullableFilter
    _max?: NestedDateTimeNullableFilter
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type PlanCreateWithoutMembersInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCanceledAt?: Date | string | null
    subscriptionStatus?: string | null
    invitations?: PlanInvitationCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateWithoutMembersInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCanceledAt?: Date | string | null
    subscriptionStatus?: string | null
    invitations?: PlanInvitationUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanCreateOrConnectWithoutMembersInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutMembersInput, PlanUncheckedCreateWithoutMembersInput>
  }

  export type PlanInvitationCreateWithoutInviterInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    claimedAt?: Date | string | null
    inviterName: string
    plan: PlanCreateNestedOneWithoutInvitationsInput
  }

  export type PlanInvitationUncheckedCreateWithoutInviterInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    claimedAt?: Date | string | null
    inviterName: string
    planId: string
  }

  export type PlanInvitationCreateOrConnectWithoutInviterInput = {
    where: PlanInvitationWhereUniqueInput
    create: XOR<PlanInvitationCreateWithoutInviterInput, PlanInvitationUncheckedCreateWithoutInviterInput>
  }

  export type AccountCreateWithoutProfileInput = {
    id?: string
    provider: string
    providerAccountId: string
    type: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountUncheckedCreateWithoutProfileInput = {
    id?: string
    provider: string
    providerAccountId: string
    type: string
    accessToken?: string | null
    refreshToken?: string | null
    tokenType?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AccountCreateOrConnectWithoutProfileInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutProfileInput, AccountUncheckedCreateWithoutProfileInput>
  }

  export type PlanUpsertWithoutMembersInput = {
    update: XOR<PlanUpdateWithoutMembersInput, PlanUncheckedUpdateWithoutMembersInput>
    create: XOR<PlanCreateWithoutMembersInput, PlanUncheckedCreateWithoutMembersInput>
  }

  export type PlanUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCanceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    invitations?: PlanInvitationUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCanceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    invitations?: PlanInvitationUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type PlanInvitationUpsertWithWhereUniqueWithoutInviterInput = {
    where: PlanInvitationWhereUniqueInput
    update: XOR<PlanInvitationUpdateWithoutInviterInput, PlanInvitationUncheckedUpdateWithoutInviterInput>
    create: XOR<PlanInvitationCreateWithoutInviterInput, PlanInvitationUncheckedCreateWithoutInviterInput>
  }

  export type PlanInvitationUpdateWithWhereUniqueWithoutInviterInput = {
    where: PlanInvitationWhereUniqueInput
    data: XOR<PlanInvitationUpdateWithoutInviterInput, PlanInvitationUncheckedUpdateWithoutInviterInput>
  }

  export type PlanInvitationUpdateManyWithWhereWithoutInviterInput = {
    where: PlanInvitationScalarWhereInput
    data: XOR<PlanInvitationUpdateManyMutationInput, PlanInvitationUncheckedUpdateManyWithoutInvitationsInput>
  }

  export type PlanInvitationScalarWhereInput = {
    AND?: Enumerable<PlanInvitationScalarWhereInput>
    OR?: Enumerable<PlanInvitationScalarWhereInput>
    NOT?: Enumerable<PlanInvitationScalarWhereInput>
    id?: StringFilter | string
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    expiresAt?: DateTimeFilter | Date | string
    claimedAt?: DateTimeNullableFilter | Date | string | null
    inviterName?: StringFilter | string
    inviterId?: StringFilter | string
    planId?: StringFilter | string
  }

  export type AccountUpsertWithWhereUniqueWithoutProfileInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutProfileInput, AccountUncheckedUpdateWithoutProfileInput>
    create: XOR<AccountCreateWithoutProfileInput, AccountUncheckedCreateWithoutProfileInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutProfileInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutProfileInput, AccountUncheckedUpdateWithoutProfileInput>
  }

  export type AccountUpdateManyWithWhereWithoutProfileInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutAccountsInput>
  }

  export type AccountScalarWhereInput = {
    AND?: Enumerable<AccountScalarWhereInput>
    OR?: Enumerable<AccountScalarWhereInput>
    NOT?: Enumerable<AccountScalarWhereInput>
    id?: StringFilter | string
    provider?: StringFilter | string
    providerAccountId?: StringFilter | string
    type?: StringFilter | string
    accessToken?: StringNullableFilter | string | null
    refreshToken?: StringNullableFilter | string | null
    tokenType?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    profileId?: StringFilter | string
  }

  export type ProfileCreateWithoutAccountsInput = {
    id?: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutMembersInput
    invitations?: PlanInvitationCreateNestedManyWithoutInviterInput
    isProductAdmin?: boolean
  }

  export type ProfileUncheckedCreateWithoutAccountsInput = {
    id?: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    planId: string
    invitations?: PlanInvitationUncheckedCreateNestedManyWithoutInviterInput
    isProductAdmin?: boolean
  }

  export type ProfileCreateOrConnectWithoutAccountsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutAccountsInput, ProfileUncheckedCreateWithoutAccountsInput>
  }

  export type ProfileUpsertWithoutAccountsInput = {
    update: XOR<ProfileUpdateWithoutAccountsInput, ProfileUncheckedUpdateWithoutAccountsInput>
    create: XOR<ProfileCreateWithoutAccountsInput, ProfileUncheckedCreateWithoutAccountsInput>
  }

  export type ProfileUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutMembersNestedInput
    invitations?: PlanInvitationUpdateManyWithoutInviterNestedInput
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    planId?: StringFieldUpdateOperationsInput | string
    invitations?: PlanInvitationUncheckedUpdateManyWithoutInviterNestedInput
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileCreateWithoutPlanInput = {
    id?: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invitations?: PlanInvitationCreateNestedManyWithoutInviterInput
    accounts?: AccountCreateNestedManyWithoutProfileInput
    isProductAdmin?: boolean
  }

  export type ProfileUncheckedCreateWithoutPlanInput = {
    id?: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    invitations?: PlanInvitationUncheckedCreateNestedManyWithoutInviterInput
    accounts?: AccountUncheckedCreateNestedManyWithoutProfileInput
    isProductAdmin?: boolean
  }

  export type ProfileCreateOrConnectWithoutPlanInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutPlanInput, ProfileUncheckedCreateWithoutPlanInput>
  }

  export type PlanInvitationCreateWithoutPlanInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    claimedAt?: Date | string | null
    inviterName: string
    inviter: ProfileCreateNestedOneWithoutInvitationsInput
  }

  export type PlanInvitationUncheckedCreateWithoutPlanInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    expiresAt: Date | string
    claimedAt?: Date | string | null
    inviterName: string
    inviterId: string
  }

  export type PlanInvitationCreateOrConnectWithoutPlanInput = {
    where: PlanInvitationWhereUniqueInput
    create: XOR<PlanInvitationCreateWithoutPlanInput, PlanInvitationUncheckedCreateWithoutPlanInput>
  }

  export type ProfileUpsertWithWhereUniqueWithoutPlanInput = {
    where: ProfileWhereUniqueInput
    update: XOR<ProfileUpdateWithoutPlanInput, ProfileUncheckedUpdateWithoutPlanInput>
    create: XOR<ProfileCreateWithoutPlanInput, ProfileUncheckedCreateWithoutPlanInput>
  }

  export type ProfileUpdateWithWhereUniqueWithoutPlanInput = {
    where: ProfileWhereUniqueInput
    data: XOR<ProfileUpdateWithoutPlanInput, ProfileUncheckedUpdateWithoutPlanInput>
  }

  export type ProfileUpdateManyWithWhereWithoutPlanInput = {
    where: ProfileScalarWhereInput
    data: XOR<ProfileUpdateManyMutationInput, ProfileUncheckedUpdateManyWithoutMembersInput>
  }

  export type ProfileScalarWhereInput = {
    AND?: Enumerable<ProfileScalarWhereInput>
    OR?: Enumerable<ProfileScalarWhereInput>
    NOT?: Enumerable<ProfileScalarWhereInput>
    id?: StringFilter | string
    fullName?: StringFilter | string
    friendlyName?: StringFilter | string
    email?: StringFilter | string
    imageUrl?: StringNullableFilter | string | null
    createdAt?: DateTimeFilter | Date | string
    updatedAt?: DateTimeFilter | Date | string
    planId?: StringFilter | string
    isProductAdmin?: BoolFilter | boolean
  }

  export type PlanInvitationUpsertWithWhereUniqueWithoutPlanInput = {
    where: PlanInvitationWhereUniqueInput
    update: XOR<PlanInvitationUpdateWithoutPlanInput, PlanInvitationUncheckedUpdateWithoutPlanInput>
    create: XOR<PlanInvitationCreateWithoutPlanInput, PlanInvitationUncheckedCreateWithoutPlanInput>
  }

  export type PlanInvitationUpdateWithWhereUniqueWithoutPlanInput = {
    where: PlanInvitationWhereUniqueInput
    data: XOR<PlanInvitationUpdateWithoutPlanInput, PlanInvitationUncheckedUpdateWithoutPlanInput>
  }

  export type PlanInvitationUpdateManyWithWhereWithoutPlanInput = {
    where: PlanInvitationScalarWhereInput
    data: XOR<PlanInvitationUpdateManyMutationInput, PlanInvitationUncheckedUpdateManyWithoutInvitationsInput>
  }

  export type ProfileCreateWithoutInvitationsInput = {
    id?: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    plan: PlanCreateNestedOneWithoutMembersInput
    accounts?: AccountCreateNestedManyWithoutProfileInput
    isProductAdmin?: boolean
  }

  export type ProfileUncheckedCreateWithoutInvitationsInput = {
    id?: string
    fullName: string
    friendlyName: string
    email: string
    imageUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    planId: string
    accounts?: AccountUncheckedCreateNestedManyWithoutProfileInput
    isProductAdmin?: boolean
  }

  export type ProfileCreateOrConnectWithoutInvitationsInput = {
    where: ProfileWhereUniqueInput
    create: XOR<ProfileCreateWithoutInvitationsInput, ProfileUncheckedCreateWithoutInvitationsInput>
  }

  export type PlanCreateWithoutInvitationsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCanceledAt?: Date | string | null
    subscriptionStatus?: string | null
    members?: ProfileCreateNestedManyWithoutPlanInput
  }

  export type PlanUncheckedCreateWithoutInvitationsInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    stripeCustomerId?: string | null
    stripeSubscriptionId?: string | null
    subscriptionExpiresAt?: Date | string | null
    subscriptionCanceledAt?: Date | string | null
    subscriptionStatus?: string | null
    members?: ProfileUncheckedCreateNestedManyWithoutPlanInput
  }

  export type PlanCreateOrConnectWithoutInvitationsInput = {
    where: PlanWhereUniqueInput
    create: XOR<PlanCreateWithoutInvitationsInput, PlanUncheckedCreateWithoutInvitationsInput>
  }

  export type ProfileUpsertWithoutInvitationsInput = {
    update: XOR<ProfileUpdateWithoutInvitationsInput, ProfileUncheckedUpdateWithoutInvitationsInput>
    create: XOR<ProfileCreateWithoutInvitationsInput, ProfileUncheckedCreateWithoutInvitationsInput>
  }

  export type ProfileUpdateWithoutInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    plan?: PlanUpdateOneRequiredWithoutMembersNestedInput
    accounts?: AccountUpdateManyWithoutProfileNestedInput
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUncheckedUpdateWithoutInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    planId?: StringFieldUpdateOperationsInput | string
    accounts?: AccountUncheckedUpdateManyWithoutProfileNestedInput
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlanUpsertWithoutInvitationsInput = {
    update: XOR<PlanUpdateWithoutInvitationsInput, PlanUncheckedUpdateWithoutInvitationsInput>
    create: XOR<PlanCreateWithoutInvitationsInput, PlanUncheckedCreateWithoutInvitationsInput>
  }

  export type PlanUpdateWithoutInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCanceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ProfileUpdateManyWithoutPlanNestedInput
  }

  export type PlanUncheckedUpdateWithoutInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    stripeCustomerId?: NullableStringFieldUpdateOperationsInput | string | null
    stripeSubscriptionId?: NullableStringFieldUpdateOperationsInput | string | null
    subscriptionExpiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionCanceledAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    subscriptionStatus?: NullableStringFieldUpdateOperationsInput | string | null
    members?: ProfileUncheckedUpdateManyWithoutPlanNestedInput
  }

  export type DefaultFoodCategoryAssignmentCreateWithoutCategoryInput = {
    id?: string
    foodName: string
    votes?: number
  }

  export type DefaultFoodCategoryAssignmentUncheckedCreateWithoutCategoryInput = {
    id?: string
    foodName: string
    votes?: number
  }

  export type DefaultFoodCategoryAssignmentCreateOrConnectWithoutCategoryInput = {
    where: DefaultFoodCategoryAssignmentWhereUniqueInput
    create: XOR<DefaultFoodCategoryAssignmentCreateWithoutCategoryInput, DefaultFoodCategoryAssignmentUncheckedCreateWithoutCategoryInput>
  }

  export type DefaultFoodCategoryAssignmentUpsertWithWhereUniqueWithoutCategoryInput = {
    where: DefaultFoodCategoryAssignmentWhereUniqueInput
    update: XOR<DefaultFoodCategoryAssignmentUpdateWithoutCategoryInput, DefaultFoodCategoryAssignmentUncheckedUpdateWithoutCategoryInput>
    create: XOR<DefaultFoodCategoryAssignmentCreateWithoutCategoryInput, DefaultFoodCategoryAssignmentUncheckedCreateWithoutCategoryInput>
  }

  export type DefaultFoodCategoryAssignmentUpdateWithWhereUniqueWithoutCategoryInput = {
    where: DefaultFoodCategoryAssignmentWhereUniqueInput
    data: XOR<DefaultFoodCategoryAssignmentUpdateWithoutCategoryInput, DefaultFoodCategoryAssignmentUncheckedUpdateWithoutCategoryInput>
  }

  export type DefaultFoodCategoryAssignmentUpdateManyWithWhereWithoutCategoryInput = {
    where: DefaultFoodCategoryAssignmentScalarWhereInput
    data: XOR<DefaultFoodCategoryAssignmentUpdateManyMutationInput, DefaultFoodCategoryAssignmentUncheckedUpdateManyWithoutFoodAssignmentsInput>
  }

  export type DefaultFoodCategoryAssignmentScalarWhereInput = {
    AND?: Enumerable<DefaultFoodCategoryAssignmentScalarWhereInput>
    OR?: Enumerable<DefaultFoodCategoryAssignmentScalarWhereInput>
    NOT?: Enumerable<DefaultFoodCategoryAssignmentScalarWhereInput>
    id?: StringFilter | string
    categoryId?: StringFilter | string
    foodName?: StringFilter | string
    votes?: IntFilter | number
  }

  export type DefaultCategoryCreateWithoutFoodAssignmentsInput = {
    id?: string
    name: string
  }

  export type DefaultCategoryUncheckedCreateWithoutFoodAssignmentsInput = {
    id?: string
    name: string
  }

  export type DefaultCategoryCreateOrConnectWithoutFoodAssignmentsInput = {
    where: DefaultCategoryWhereUniqueInput
    create: XOR<DefaultCategoryCreateWithoutFoodAssignmentsInput, DefaultCategoryUncheckedCreateWithoutFoodAssignmentsInput>
  }

  export type DefaultCategoryUpsertWithoutFoodAssignmentsInput = {
    update: XOR<DefaultCategoryUpdateWithoutFoodAssignmentsInput, DefaultCategoryUncheckedUpdateWithoutFoodAssignmentsInput>
    create: XOR<DefaultCategoryCreateWithoutFoodAssignmentsInput, DefaultCategoryUncheckedCreateWithoutFoodAssignmentsInput>
  }

  export type DefaultCategoryUpdateWithoutFoodAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type DefaultCategoryUncheckedUpdateWithoutFoodAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type PlanInvitationUpdateWithoutInviterInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
    plan?: PlanUpdateOneRequiredWithoutInvitationsNestedInput
  }

  export type PlanInvitationUncheckedUpdateWithoutInviterInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
  }

  export type PlanInvitationUncheckedUpdateManyWithoutInvitationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
    planId?: StringFieldUpdateOperationsInput | string
  }

  export type AccountUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateWithoutProfileInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AccountUncheckedUpdateManyWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    accessToken?: NullableStringFieldUpdateOperationsInput | string | null
    refreshToken?: NullableStringFieldUpdateOperationsInput | string | null
    tokenType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProfileUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invitations?: PlanInvitationUpdateManyWithoutInviterNestedInput
    accounts?: AccountUpdateManyWithoutProfileNestedInput
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    invitations?: PlanInvitationUncheckedUpdateManyWithoutInviterNestedInput
    accounts?: AccountUncheckedUpdateManyWithoutProfileNestedInput
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ProfileUncheckedUpdateManyWithoutMembersInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    friendlyName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    isProductAdmin?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PlanInvitationUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
    inviter?: ProfileUpdateOneRequiredWithoutInvitationsNestedInput
  }

  export type PlanInvitationUncheckedUpdateWithoutPlanInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    claimedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    inviterName?: StringFieldUpdateOperationsInput | string
    inviterId?: StringFieldUpdateOperationsInput | string
  }

  export type DefaultFoodCategoryAssignmentUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    foodName?: StringFieldUpdateOperationsInput | string
    votes?: IntFieldUpdateOperationsInput | number
  }

  export type DefaultFoodCategoryAssignmentUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    foodName?: StringFieldUpdateOperationsInput | string
    votes?: IntFieldUpdateOperationsInput | number
  }

  export type DefaultFoodCategoryAssignmentUncheckedUpdateManyWithoutFoodAssignmentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    foodName?: StringFieldUpdateOperationsInput | string
    votes?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}