/**
 * Simple in-memory token jti store for "one token per consumption".
 * In production, use DynamoDB/Redis with TTL.
 */
const usedJti = new Set();

export function isUsed(jti) {
  return usedJti.has(jti);
}

export function markUsed(jti) {
  usedJti.add(jti);
}

// naive cleanup hook (optional)
export function resetAll() {
  usedJti.clear();
}
