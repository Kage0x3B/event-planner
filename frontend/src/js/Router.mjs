/* global history, location */
// semistandard is a stupid tool, just configure eslint properly!

import { loadRouteMetadata } from '../generated/routeMetadata.generated.mjs';

export class Router {
  /**
   * @return {Router}
   */
  static getInstance () {
    if (!Router.routerInstance) {
      Router.routerInstance = new Router();
    }

    return Router.routerInstance;
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
      matchingRoute.pageParameterNames.forEach((paramName, i) => {
        params[paramName] = regexMatches[i + 1];
      });
      const queryParams = new URLSearchParams(location.search);

      this.activeRoute = matchingRoute.routeInstance;

      if (this.activeRoute) {
        let pageData;

        if (this.activeRoute.loadData) {
          try {
            pageData = await this.activeRoute.loadData({ params, query: queryParams });
          } catch (err) {
            // If a redirect signal is thrown
            if (err.redirectUrl) {
              return this.navigateTo(err.redirectUrl, true);
            } else {
              throw err;
            }
          }
        }

        let pageTitle = this.activeRoute.getTitle(pageData, { params, query: queryParams });

        pageTitle += (pageTitle.length ? ' | ' : '') + 'EventPlanner24';

        if (typeof matchingRoute.html === 'function') {
          this.pageContainer.innerHTML = matchingRoute.html({
            data: pageData,
            params,
            query: queryParams
          });
        } else {
          this.pageContainer.innerHTML = matchingRoute.html;
        }

        document.title = pageTitle;

        try {
          this.activeRoute.onMount(this.pageContainer, pageData, { params, query: queryParams });
        } catch (err) {
          // If a redirect signal is thrown
          if (err.redirectUrl) {
            return this.navigateTo(err.redirectUrl, true);
          } else {
            throw err;
          }
        }

        console.info('Mounted route');
      } else {
        if (typeof matchingRoute.html === 'function') {
          this.pageContainer.innerHTML = matchingRoute.html({
            data: {},
            params
          });
        } else {
          this.pageContainer.innerHTML = matchingRoute.html;
        }
      }
    } else {
      console.error('404 for path', currentPath);
    }
  }
}
