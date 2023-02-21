import { AbstractRoute } from '../../js/AbstractRoute.mjs';
import eventApi from '../../js/api/eventApi.mjs';

/** @typedef {{ hello: string; someNumber: number }} PageData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class EventInfoRoute extends AbstractRoute {
  /**
   * @param {{ eventId: number }} params
   * @returns {Promise<PageData>}
   */
  async loadData ({ eventId }) {
    console.log('Loading data in /event/:eventId (' + eventId + ') route');
    return eventApi.getEvent(eventId);
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
