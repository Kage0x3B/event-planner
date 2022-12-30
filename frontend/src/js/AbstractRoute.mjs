/**
 * @implements {import('../types/Route').IRoute}
 */
export class AbstractRoute {
  /**
   * Load data asynchronously before displaying the page
   *
   * @returns {Promise<unknown>}
   */
  async loadData () {
    return undefined;
  }

  /**
   * Called when a route is navigated to, after the pageContainer containing the pages html was mounted
   *
   * @param {HTMLDivElement} pageContainer
   * @param {unknown} data
   * @returns {void}
   */
  onMount (pageContainer, data) {

  }

  /**
   * Called when a route is being navigated away from, after the pageContainer was removed from the document
   *
   * @returns {void}
   */
  onDestroy () {

  }

  /**
   * @param {unknown} data
   * @returns {string} the html page title
   */
  getTitle (data) {
    return 'Veranstaltung24';
  }
}
