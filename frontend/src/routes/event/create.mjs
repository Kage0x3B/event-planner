import { AbstractRoute } from '../../js/AbstractRoute.mjs';
import eventApi from '../../js/api/eventApi.mjs';
import { Router } from '../../js/Router.mjs';

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class CreateEventRoute extends AbstractRoute {
  /**
   * @param {HTMLDivElement} pageContainer
   * @param {undefined} data
   * @returns {void}
   */
  async onMount (pageContainer, data, {}) {
    this.createEventForm = document.getElementById('createEventForm');
    this.createEventForm.addEventListener('submit', this.onSubmit);
  }

  /**
   * @param {SubmitEvent} event
   */
  async onSubmit (event) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));

    try {
      const res = await eventApi.createEvent(formData);

      await Router.getInstance().navigateTo(`/event/info/${res.eventId}`, true);
    } catch (err) {
      alert('Die Veranstaltung konnte nicht erstellt werden, bitte überprüfen Sie Ihre Eingaben.');
    }
  }

  getTitle (data, {}) {
    return 'Veranstaltung erstellen';
  }
}
