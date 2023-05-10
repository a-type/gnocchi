const TWO_DAYS = 1000 * 60 * 60 * 24 * 2;
const THIRTY_MINUTES = 1000 * 60 * 30;
// for local development (defined by env var), use five minutes

export const SESSION_TIMEOUT = import.meta.env.DEV ? THIRTY_MINUTES : TWO_DAYS;
