export class Router {
    async initializeRouting() {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.addEventListener('click', this.onLinkClicked.bind(this));
        });
    }

    /**
     * When the user clicks on a link
     *
     * @param {MouseEvent} event
     */
    async onLinkClicked(event) {
        if (event.target && event.target.hasOwnProperty('href')) {
            /** @type {HTMLAnchorElement} */
            const targetLink = event.target;

            if (targetLink.relList.contains('external')) {
                return;
            }

            event.preventDefault();
            await this.navigateTo(targetLink.href);
        }
    }

    async navigateTo(url, options) {

    }
}