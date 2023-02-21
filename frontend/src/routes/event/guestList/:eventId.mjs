import { AbstractRoute } from '../../../js/AbstractRoute.mjs';
import guestApi from '../../../js/api/guestApi.mjs';
import eventApi from '../../../js/api/eventApi.mjs';
import { Router } from '../../../js/Router.mjs';

/** @typedef {{event: import('backend/src/types/Event').Event; guestList: import('backend/src/types/Guest').Guest[]}} PageData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class EventGuestListRoute extends AbstractRoute {
  /**
   * @param {{ eventId: number }} params
   * @returns {Promise<PageData>}
   */
  async loadData ({ eventId }) {
    const [event, guestList] = await Promise.all([eventApi.getEvent(eventId), guestApi.listGuests(eventId)]);

    return {
      event,
      guestList
    };
  }

  /**
   * @param pageContainer
   * @param {PageData} data
   * @returns {void}
   */
  async onMount (pageContainer, data) {
    this.addGuestForm = document.getElementById('addGuestForm');
    this.addGuestForm.addEventListener('submit', (e) => this.onSubmit(e, data));

    for (const select of pageContainer.getElementsByClassName('invitation-status-select')) {
      select.addEventListener('change', this.onChangeInvitationStatus);
    }

    for (const button of pageContainer.getElementsByClassName('delete-guest-button')) {
      button.addEventListener('click', this.onClickDeleteGuest);
    }
  }

  /**
   * @param {SubmitEvent} event
   * @param {PageData} data
   */
  async onSubmit (event, data) {
    event.preventDefault();

    const formData = Object.fromEntries(new FormData(event.target));

    const firstName = formData.firstName.toLowerCase().trim();
    const lastName = formData.lastName.toLowerCase().trim();
    if (data.guestList.some(guest => guest.firstName.toLowerCase().trim() === firstName && guest.lastName.toLowerCase().trim() === lastName)) {
      alert('Ein Gast mit demselben Namen existiert bereits, bitte überprüfen Sie Ihre Eingaben.');

      return;
    }

    try {
      await guestApi.createGuest({
        ...formData,
        eventId: data.event.id,
        isChild: formData.isChild === 'on'
      });

      await Router.getInstance().navigateTo(`/event/guestList/${data.event.id}?add`, true);
    } catch (err) {
      console.error(err);
      alert('Der Gast konnte nicht hinzugefügt werden, bitte überprüfen Sie Ihre Eingaben.');
    }
  }

  /**
   * @param {MouseEvent} event
   */
  async onClickDeleteGuest (event) {
    /**
     * @type {HTMLButtonElement}
     */
    const button = event.target;
    const guestId = Number(button.dataset.guestId);

    if (guestId && confirm('Soll der Gast wirklich gelöscht werden?')) {
      try {
        await guestApi.deleteGuest(guestId);
        await Router.getInstance().reloadPage();
      } catch (err) {
        alert('Der Gast konnte nicht gelöscht werden, bitte versuchen Sie es erneut.');
      }
    }
  }

  /**
   * @param {Event} event
   */
  async onChangeInvitationStatus (event) {
    /**
     * @type {HTMLSelectElement}
     */
    const select = event.target;
    const guestId = Number(select.dataset.guestId);

    if (guestId) {
      try {
        await guestApi.updateInvitationStatus({
          id: guestId,
          invitationStatus: select.value
        });
        await Router.getInstance().reloadPage();
      } catch (err) {
        alert('Der Gast konnte nicht gelöscht werden, bitte versuchen Sie es erneut.');
      }
    }
  }

  /**
   * @param {PageData} data
   * @return {string}
   */
  getTitle (data) {
    return data.event.name;
  }
}
