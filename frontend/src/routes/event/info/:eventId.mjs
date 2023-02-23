import { AbstractRoute } from '../../../js/AbstractRoute.mjs';
import eventApi from '../../../js/api/eventApi.mjs';

/** @typedef {import('backend/src/types/Event').Event} PageData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class EventInfoRoute extends AbstractRoute {
  /**
   * @param {{ eventId: number }} params
   * @returns {Promise<PageData>}
   */
  async loadData ({ params }) {
    return eventApi.getEvent(params.eventId);
  }

  /**
   * @param pageContainer
   * @param {PageData} data
   * @returns {void}
   */
  async onMount (pageContainer, data, {}) {
  }

  /**
   * @param {PageData} data
   * @return {string}
   */
  getTitle (data, {}) {
    return data.name;
  }
}
