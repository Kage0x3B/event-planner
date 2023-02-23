class RedirectSignal extends Error {
  /**
   * @param redirectUrl the url to redirect to
   */
  constructor (redirectUrl) {
    super('RedirectSignal');

    this.redirectUrl = redirectUrl;
  }
}

/**
 * Request to redirect to another page while in loadData or onMount.
 *
 * @param newUrl the url of the new page to redirect to
 * @return {RedirectSignal} a signal error which should be thrown
 */
export function redirect (newUrl) {
  return new RedirectSignal(newUrl);
}
