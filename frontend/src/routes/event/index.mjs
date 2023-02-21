import { AbstractRoute } from '../../js/AbstractRoute.mjs';
import eventApi from '../../js/api/eventApi.mjs';
import { DateTime } from 'luxon';

/** @typedef {{ hello: string; someNumber: number }} PageData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class EventListRoute extends AbstractRoute {
  /**
   * @returns {Promise<PageData>}
   */
  loadData = eventApi.listEvents;

  /**
   * @param pageContainer
   * @param data {PageData}
   * @returns {void}
   */
  async onMount (pageContainer, data) {
    console.info('Hello World in event info!');
    DateTime.DATETIME_MED
  }
}
