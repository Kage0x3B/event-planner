import { loadRouteMetadata } from './generated/routeMetadata.generated.mjs';

export class Router {
  constructor () {
    /** @type {(import('../../types/Route').RouteMetadata)[]} */
    this.routeMetadata = [];
    /** @type {HTMLDivElement} */
    this.pageContainer = document.getElementById('app');
    /** @type {(import('../types/Route').IRoute) | undefined} */
    this.activeRoute = undefined;

    if (!this.pageContainer) {
      throw new Error(`Could not find app container element! Make sure a div with the id 'app' exists in the page.`);
    }
  }

  async initializeRouting () {
    this.routeMetadata = await loadRouteMetadata();

    document.addEventListener('DOMContentLoaded', async () => {
      await this.updateRouting();

      window.addEventListener('popstate', this.updateRouting.bind(this));
      document.body.addEventListener('click', this.onLinkClicked.bind(this));
    });
  }

  /**
   * When the user clicks on a link
   *
   * @param {MouseEvent} event
   */
  async onLinkClicked (event) {
    const isLinkTarget = event.target && typeof event.target.tagName === 'string' && event.target.tagName.toLowerCase() === 'a';
    console.log('isLinkTarget', isLinkTarget, typeof event.target.href);
    if (isLinkTarget && typeof event.target.href === 'string') {
      event.preventDefault();

      /** @type {HTMLAnchorElement} */
      const targetLink = event.target;
      const href = targetLink.href;

      const isExternalLink = targetLink.relList.contains('external');
      console.log('isExternalLink', isExternalLink, href);
      if (isExternalLink || href.startsWith('#')) {
        return;
      }

      await this.navigateTo(targetLink.href);
    }
  }

  /**
   * Navigate to a different page
   *
   * @param url the url of the page
   * @param replaceState {boolean} if the current page should be replaced in the browsers history stack
   * @return {Promise<void>}
   */
  async navigateTo (url, replaceState = false) {
    if (replaceState) {
      history.replaceState(null, null, url);
    } else {
      history.pushState(null, null, url);
    }

    await this.updateRouting();
  }

  async updateRouting () {
    console.info('Updating routing...');

    const currentPath = location.pathname;
    console.log('currentPath', currentPath);

    console.log(this.routeMetadata);
    const matchingRoute = this.routeMetadata.find(route => route.pathRegex.test(currentPath));
    console.log('matchingRoute', matchingRoute);

    if (matchingRoute) {
      if (this.activeRoute) {
        this.activeRoute.onDestroy();
      }

      this.activeRoute = matchingRoute.routeInstance;
      this.pageContainer.innerHTML = matchingRoute.html;

      if (this.activeRoute) {
        const pageData = this.activeRoute.loadData();
        this.activeRoute.onMount(this.pageContainer, pageData);

        console.info('Mounted route');
      }
    } else {
      console.error('404 for path', currentPath);
    }
  }
}
