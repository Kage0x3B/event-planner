import { AbstractRoute } from '../../js/AbstractRoute.mjs';
import eventApi from '../../js/api/eventApi.mjs';
import { Router } from '../../js/Router.mjs';
import { debounce } from '../../js/util/util.mjs';
import { redirect } from '../../js/util/RedirectSignal.mjs';

/** @typedef {import('backend/src/types/PaginatedResponse').PaginatedResponse<import('backend/src/types/Event').Event>} PageData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class EventListRoute extends AbstractRoute {
  constructor () {
    super();

    this.onResize = debounce(this._onResize, 100);
  }

  /**
   * @param {{ eventId: number }} params
   * @param {URLSearchParams} query
   * @returns {Promise<PageData>}
   */
  async loadData ({ params, query }) {
    const listItemAmount = this.calculateMaxListItemAmount();
    const page = query.has('page') ? Number(query.get('page')) : 1;
    const start = (page - 1) * listItemAmount;

    const paginatedData = await eventApi.listEvents({
      start,
      amount: listItemAmount
    });

    if (!paginatedData.data.length && paginatedData.totalAmount) {
      throw redirect(`/event?page=${Math.ceil(paginatedData.totalAmount / paginatedData.amount)}`);
    }

    return paginatedData;
  }

  /**
   * @param pageContainer
   * @param data {PageData}
   * @returns {void}
   */
  async onMount (pageContainer, data, {}) {
    window.addEventListener('resize', this.onResize);

    for (const button of pageContainer.getElementsByClassName('delete-event-button')) {
      button.addEventListener('click', this.onClickDeleteEvent);
    }
  }

  onDestroy () {
    window.removeEventListener('resize', this.onResize);
  }

  async _onResize () {
    await Router.getInstance().reloadPage();
  }

  /**
   * Dynamically calculates the max amount of event list entries which can be shown at the current screen height.
   *
   * @return {number}
   */
  calculateMaxListItemAmount () {
    const pageHeight = document.documentElement.clientHeight;
    const navigationHeight = 64;
    const cardMarginY = 40 * 2;
    const cardPaddingY = 32 * 2;
    const titleHeight = 28 /* line-height */ + 16 /* margin-bottom */;
    const listItemHeight = 56;
    const paginationHeight = /* button height */ 32 + /* margin-top */ 16;

    const availableListHeight = pageHeight - navigationHeight - cardMarginY - cardPaddingY - titleHeight - paginationHeight;
    const maxListItemAmount = Math.max(1, Math.floor(availableListHeight / listItemHeight));

    return maxListItemAmount;
  }

  getTitle (data, {}) {
    return 'Alle Veranstaltungen';
  }

  /**
   * @param {MouseEvent} event
   */
  async onClickDeleteEvent (event) {
    /**
     * @type {HTMLButtonElement}
     */
    const button = event.target;
    const eventId = Number(button.dataset.eventId);

    if (eventId && confirm('Soll die Veranstaltung wirklich gelöscht werden?')) {
      try {
        await eventApi.deleteEvent(eventId);
        await Router.getInstance().reloadPage();
      } catch (err) {
        alert('Die Veranstaltung konnte nicht gelöscht werden, bitte versuchen Sie es erneut.');
      }
    }
  }
}
