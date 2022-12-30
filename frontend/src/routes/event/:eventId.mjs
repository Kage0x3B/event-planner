import { AbstractRoute } from '../../js/AbstractRoute.mjs';

/** @typedef {{ hello: string; someNumber: number }} PageData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class EventInfoRoute extends AbstractRoute {
  /**
   * @returns {Promise<PageData>}
   */
  async loadData () {
    console.log('Loading data in /event/:eventId route');
  }

  /**
   * @param pageContainer
   * @param data {PageData}
   * @returns {void}
   */
  async onMount (pageContainer, data) {
    console.info('Hello World in event info!');
  }
}
