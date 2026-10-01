import { Injectable } from '@angular/core';
import { KnoraApiConnection, KnoraApiConfig } from '@dasch-swiss/dsp-js';
import { ApiReadQueue } from './api-read-queue';

@Injectable()
export class AppInitService {

    static knoraApiConnection: KnoraApiConnection;

    static knoraApiConfig: KnoraApiConfig;

    constructor() { }

    Init() {

        return new Promise<void>((resolve, reject) => {

            // init knora-api configuration
            const knora = window['tempConfigStorage'].knora;
            AppInitService.knoraApiConfig = new KnoraApiConfig(
                knora.apiProtocol, 
                knora.apiHost, 
                knora.apiPort, 
                knora.apiPath, 
                undefined,
                knora.logErrors);

            // set knora-api connection configuration
            AppInitService.knoraApiConnection = new KnoraApiConnection(AppInitService.knoraApiConfig);

            // One queue per application connection for public reads. getResource
            // delegates to getResources in dsp-js; wrapping both would queue twice.
            // Authentication, writes and IIIF requests are deliberately unchanged.
            const queue = new ApiReadQueue();
            const { res, search } = AppInitService.knoraApiConnection.v2;
            res.getResources = queue.wrap(res.getResources.bind(res));
            search.doExtendedSearch = queue.wrap(search.doExtendedSearch.bind(search));
            search.doFulltextSearch = queue.wrap(search.doFulltextSearch.bind(search));

            resolve();
        });
    }
}
