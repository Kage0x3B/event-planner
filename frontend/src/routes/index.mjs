import { AbstractRoute } from '../js/AbstractRoute.mjs';

/** @typedef {{ hello: string; someNumber: number }} IndexData */

/**
 * @extends {AbstractRoute}
 * @implements {import('../types/Route').IRoute}
 */
export default class IndexRoute extends AbstractRoute {
    /**
     * @returns {Promise<IndexData>}
     */
    async loadData() {
        console.log('Loading data in index route');
    }

    /**
     * @param pageContainer
     * @param data {IndexData}
     * @returns {void}
     */
    async onMount(pageContainer, data) {
        console.info('Hello World!');
    }
}
