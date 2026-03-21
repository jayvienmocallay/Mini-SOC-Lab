/**
 * Persistent local storage service for the Mini SOC Lab.
 * Provides typed get/set with JSON serialization and namespace isolation.
 */

const PREFIX = "mini-soc-lab:";

export function loadState<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`${PREFIX}${key}`);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export function removeState(key: string): void {
  localStorage.removeItem(`${PREFIX}${key}`);
}

/**
 * React hook–compatible helper: returns a load/save pair for a specific key.
 * Usage in useState initializer: useState(() => loadState("checklist", {}))
 */
export function createPersistence<T>(key: string, defaultValue: T) {
  return {
    load: () => loadState(key, defaultValue),
    save: (value: T) => saveState(key, value),
  };
}
