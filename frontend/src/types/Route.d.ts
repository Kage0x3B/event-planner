export interface IRoute {
    /**
     * Load data asynchronously before displaying the page
     */
    loadData?(): Promise<unknown>;

    /**
     * Called when a route is navigated to, after the pageContainer containing the pages html was mounted
     */
    onMount?(pageContainer: HTMLDivElement, data?: unknown): void;

    /**
     * Called when a route is being navigated away from, after the pageContainer was removed from the document
     */
    onDestroy(): void;

    /**
     * @param {unknown} data
     * @returns the html page title
     */
    getTitle(data?: unknown): string;
}

export interface GeneratorRouteMetadata {
    id: string;
    routeClassFilePath: string | undefined;
    html: string;
}

export interface RouteMetadata {
    id: string;
    routeInstance: IRoute | undefined;
    html: string;
}