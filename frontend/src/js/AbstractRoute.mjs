import autoBind from 'auto-bind';

/**
 * @implements {import('../types/Route').IRoute}
 */
export class AbstractRoute {
  constructor () {
    autoBind(this);
  }

  /**
   * Load data asynchronously before displaying the page
   *
   * @param {any} params
   * @param {URLSearchParams} query
   * @returns {Promise<unknown>}
   */
  async loadData ({ params, query }) {
    return undefined;
  }

  /**
   * Called when a route is navigated to, after the pageContainer containing the pages html was mounted
   *
   * @param {HTMLDivElement} pageContainer
   * @param {unknown} data
   * @param {any} params
   * @param {URLSearchParams} query
   * @returns {void}
   */
  onMount (pageContainer, data, { params, query }) {

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
   * @param {any} params
   * @param {URLSearchParams} query
   * @returns {string} the html page title
   */
  getTitle (data, { params, query }) {
    return '';
  }
}
