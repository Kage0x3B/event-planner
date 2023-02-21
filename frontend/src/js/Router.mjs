/* global history, location */
// semistandard is a stupid tool, just configure eslint properly!

import { loadRouteMetadata } from '../generated/routeMetadata.generated.mjs';

const loadingSpinnerHtml = `
<div class='flex justify-center'>
  <div class='loading-ripple'>
    <div></div>
    <div></div>
  </div>
</div>`;

export class Router {
  /**
   * @private
   */
  static #routerInstance;

  /**
   * @return {Router}
   */
  static getInstance () {
    if (!Router.#routerInstance) {
      Router.#routerInstance = new Router();
    }

    return Router.#routerInstance;
  }

  constructor () {
    /** @type {(import('../../types/Route').RouteMetadata)[]} */
    this.routeMetadata = [];
    /** @type {HTMLDivElement} */
    this.pageContainer = document.getElementById('page');
    /** @type {(import('../types/Route').IRoute) | undefined} */
    this.activeRoute = undefined;

    if (!this.pageContainer) {
      throw new Error('Could not find app container element! Make sure a div with the id "page" exists in the page.');
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

    if (isLinkTarget && typeof event.target.href === 'string') {
      event.preventDefault();

      /** @type {HTMLAnchorElement} */
      const targetLink = event.target;
      const href = targetLink.href;

      const isSamePage = href === location.href;
      const isExternalLink = targetLink.relList.contains('external');
      if (isSamePage || isExternalLink || href.startsWith('#')) {
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

  async reloadPage () {
    await this.updateRouting();
  }

  async updateRouting () {
    const currentPath = location.pathname;

    const matchingRoute = this.routeMetadata.find(route => route.pathRegex.test(currentPath));

    if (matchingRoute) {
      console.info('Navigating to route', matchingRoute);

      if (this.activeRoute) {
        this.activeRoute.onDestroy();
      }

      const regexMatches = matchingRoute.pathRegex.exec(currentPath);
      const params = {};
      matchingRoute.pageParameterNames.forEach((paramName, i) => params[paramName] = regexMatches[i + 1]);

      this.activeRoute = matchingRoute.routeInstance;

      if (this.activeRoute) {
        let pageData;

        if (this.activeRoute.loadData) {
          //this.pageContainer.innerHTML = loadingSpinnerHtml;
          pageData = await this.activeRoute.loadData(params);
        }

        let pageTitle = this.activeRoute.getTitle(pageData);

        pageTitle += (pageTitle.length ? ' | ' : '') + 'EventPlanner24';

        this.pageContainer.innerHTML = typeof matchingRoute.html === 'function' ? matchingRoute.html({
          data: pageData,
          params
        }) : matchingRoute.html;
        document.title = pageTitle;
        this.activeRoute.onMount(this.pageContainer, pageData);

        console.info('Mounted route');
      } else {
        this.pageContainer.innerHTML = typeof matchingRoute.html === 'function' ? matchingRoute.html({
          data: {},
          params
        }) : matchingRoute.html;
      }
    } else {
      console.error('404 for path', currentPath);
    }
  }
}
