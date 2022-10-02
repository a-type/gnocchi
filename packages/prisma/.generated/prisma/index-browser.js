
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.3.1
 * Query Engine version: c875e43600dfe042452e0b868f7a48b817b9640b
 */
Prisma.prismaVersion = {
  client: "4.3.1",
  engine: "c875e43600dfe042452e0b868f7a48b817b9640b"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.AccountScalarFieldEnum = makeEnum({
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
});

exports.Prisma.DefaultCategoryScalarFieldEnum = makeEnum({
  id: 'id',
  name: 'name'
});

exports.Prisma.DefaultFoodCategoryAssignmentScalarFieldEnum = makeEnum({
  id: 'id',
  categoryId: 'categoryId',
  foodName: 'foodName',
  votes: 'votes'
});

exports.Prisma.PlanInvitationScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  expiresAt: 'expiresAt',
  claimedAt: 'claimedAt',
  inviterName: 'inviterName',
  inviterId: 'inviterId',
  planId: 'planId'
});

exports.Prisma.PlanScalarFieldEnum = makeEnum({
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt',
  stripeCustomerId: 'stripeCustomerId',
  stripeSubscriptionId: 'stripeSubscriptionId',
  subscriptionExpiresAt: 'subscriptionExpiresAt',
  subscriptionCanceledAt: 'subscriptionCanceledAt',
  subscriptionStatus: 'subscriptionStatus'
});

exports.Prisma.ProfileScalarFieldEnum = makeEnum({
  id: 'id',
  fullName: 'fullName',
  friendlyName: 'friendlyName',
  email: 'email',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  planId: 'planId',
  isProductAdmin: 'isProductAdmin'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});


exports.Prisma.ModelName = makeEnum({
  Profile: 'Profile',
  Account: 'Account',
  Plan: 'Plan',
  PlanInvitation: 'PlanInvitation',
  DefaultCategory: 'DefaultCategory',
  DefaultFoodCategoryAssignment: 'DefaultFoodCategoryAssignment'
});

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
