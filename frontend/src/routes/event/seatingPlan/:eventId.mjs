import { AbstractRoute } from '../../../js/AbstractRoute.mjs';
import eventApi from '../../../js/api/eventApi.mjs';
import guestApi from '../../../js/api/guestApi.mjs';
import seatingPlanApi from '../../../js/api/seatingPlanApi.mjs';
import { Router } from '../../../js/Router.mjs';

/** @typedef {{event: import('backend/src/types/Event').Event; guestList: import('backend/src/types/Guest').Guest[]; seatingPlan: import('backend/src/types/Seat').SeatingPlan}} PageData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class EventSeatingPlanRoute extends AbstractRoute {
  /**
   * @param {{ eventId: number }} params
   * @returns {Promise<PageData>}
   */
  async loadData ({ params }) {
    const [event, guestList, seatingPlan] = await Promise.all([eventApi.getEvent(params.eventId), guestApi.listGuests(params.eventId), seatingPlanApi.getSeatingPlan(params.eventId)]);

    return {
      event,
      guestList,
      seatingPlan
    };
  }

  /**
   * @param pageContainer
   * @param {PageData} data
   * @returns {void}
   */
  async onMount (pageContainer, data, {}) {
    for (const seatDragTarget of pageContainer.getElementsByClassName('seat-drag-target')) {
      seatDragTarget.addEventListener('dragenter', this.onGuestDragEnter);
      seatDragTarget.addEventListener('dragover', this.onGuestDragOver);
      seatDragTarget.addEventListener('dragleave', this.onGuestDragLeave);
      seatDragTarget.addEventListener('drop', (e) => this.onGuestDrop(e, data));
    }
    for (const guestDraggable of pageContainer.getElementsByClassName('guest-draggable')) {
      guestDraggable.addEventListener('dragstart', this.onGuestDragStart);
    }
  }

  /**
   * @param {DragEvent} event
   */
  onGuestDragStart (event) {
    console.log('dragstart guest', event, 'guestId', event.target.dataset.guestId);
    event.dataTransfer.effectAllowed = 'link';
    event.dataTransfer.dropEffect = 'link';
    event.dataTransfer.setData('text/plain', event.target.dataset.guestName);
    event.dataTransfer.setData('text/guest-id', event.target.dataset.guestId);
  }

  /**
   * @param {DragEvent} event
   */
  onGuestDragEnter (event) {
    console.log('dragenter');
    const isGuest = event.dataTransfer.types.includes('text/guest-id');

    if (isGuest) {
      event.dataTransfer.effectAllowed = 'link';
      event.dataTransfer.dropEffect = 'link';
      event.preventDefault();

      event.target.classList.add('border', 'border-accent');
    }
  }

  /**
   * @param {DragEvent} event
   */
  onGuestDragOver (event) {
    const isGuest = event.dataTransfer.types.includes('text/guest-id');

    if (isGuest) {
      event.dataTransfer.effectAllowed = 'link';
      event.dataTransfer.dropEffect = 'link';
      event.preventDefault();
    }
  }

  /**
   * @param {DragEvent} event
   */
  onGuestDragLeave (event) {
    event.target.classList.remove('border', 'border-accent');
  }

  /**
   * @param {DragEvent} event
   * @param {PageData} data
   */
  async onGuestDrop (event, data) {
    const isGuest = event.dataTransfer.types.includes('text/guest-id');

    if (isGuest) {
      const guestId = Number(event.dataTransfer.getData('text/guest-id'));
      const seatNo = Number(event.target.dataset.seatNo);

      event.target.classList.remove('border', 'border-accent');
      event.preventDefault();

      try {
        await seatingPlanApi.assignSeat({
          eventId: data.event.id,
          guestId,
          seatNo
        });

        await Router.getInstance().reloadPage();
      } catch (err) {
        console.log(err);
        alert('Der Sitzplatz konnte nicht zugewiesen werden, bitte versuchen Sie es erneut.');
      }
    }
  }

  /**
   * @param {PageData} data
   * @return {string}
   */
  getTitle (data, {}) {
    return 'Sitzplan | ' + data.event.name;
  }
}
