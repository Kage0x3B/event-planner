import { AbstractRoute } from '../../../js/AbstractRoute.mjs';
import eventApi from '../../../js/api/eventApi.mjs';

/** @typedef {import('backend/src/types/Event').Event} PageData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class EventSeatingPlanRoute extends AbstractRoute {
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
   * @param {PageData} data
   * @returns {void}
   */
  async onMount (pageContainer, data) {
    console.info('Hello World in event info!');
  }

  /**
   * @param {PageData} data
   * @return {string}
   */
  getTitle (data) {
    return data.name;
  }
}
