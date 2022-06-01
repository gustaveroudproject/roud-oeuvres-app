import { Injectable } from '@angular/core';
import { KnoraApiConnection, KnoraApiConfig } from '@dasch-swiss/dsp-js';

@Injectable()
export class AppInitService {

    static knoraApiConnection: KnoraApiConnection;

    static knoraApiConfig: KnoraApiConfig;

    constructor() { }

    Init() {

        return new Promise<void>((resolve, reject) => {

            // init knora-api configuration
            AppInitService.knoraApiConfig = window['tempConfigStorage'] as KnoraApiConfig;

            // set knora-api connection configuration
            AppInitService.knoraApiConnection = new KnoraApiConnection(AppInitService.knoraApiConfig);

            resolve();
        });
    }
}