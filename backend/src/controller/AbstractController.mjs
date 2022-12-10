import autoBind from 'auto-bind';

export class AbstractController {
    constructor() {
        autoBind(this);
    }

    /**
     * @return {import('express').Router}
     */
    getRouter() {
        /*
         * hacky way to make an abstract method because normal Javascript doesn't support abstract methods
         */
        throw new Error('Method getRouter not implemented');
    }

    /**
     * Return the path prefix this controller should be registered at.
     * Notice that the paths of all api controllers start with `/api`.
     *
     * @return {string}
     */
    getPath() {
        throw new Error('Method getPath not implemented');
    }
}
