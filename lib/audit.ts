export type AuditEvent = { type: string; timestamp: string; payload?: any; route?: string };

export const logEvent = (type: string, payload?: any, route?: string) => {
  if (typeof window === 'undefined') return;
  const key = 'auditLog';
  const now: AuditEvent = { type, payload, route, timestamp: new Date().toISOString() };
  const arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.push(now);
  localStorage.setItem(key, JSON.stringify(arr));
};

export const readAudit = (): AuditEvent[] => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('auditLog') || '[]');
  } catch {
    return [];
  }
};

export const clearAudit = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auditLog');
};
