export type LoadResult<T> = { ok: true; data: T } | { ok: false; error: Error };

/**
 * Runs a service call and converts a rejection into a value instead of an exception.
 *
 * Pages use this so that an unavailable endpoint degrades into a scoped error state
 * within the normal page shell, rather than unwinding to the route-level error
 * boundary and replacing the whole document. The service layer stays untouched, so
 * the UI → Feature/Domain → API Client/Service → API → Content Source chain is preserved.
 */
export async function loadAsync<T>(load: () => Promise<T>): Promise<LoadResult<T>> {
  try {
    return { ok: true, data: await load() };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error("The requested content is unavailable.")
    };
  }
}