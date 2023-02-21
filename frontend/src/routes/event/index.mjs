import { AbstractRoute } from '../../js/AbstractRoute.mjs';
import eventApi from '../../js/api/eventApi.mjs';
import { Router } from '../../js/Router.mjs';

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
    for (const button of pageContainer.getElementsByClassName('delete-event-button')) {
      button.addEventListener('click', this.onClickDeleteEvent);
    }
  }

  getTitle (data) {
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
