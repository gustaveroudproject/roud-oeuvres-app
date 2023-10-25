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
            const knora = window['tempConfigStorage'].knora;
            AppInitService.knoraApiConfig = new KnoraApiConfig(
                knora.apiProtocol, 
                knora.apiHost, 
                knora.apiPort, 
                knora.apiPath, 
                knora.jsonWebToken, 
                knora.logErrors);

            // set knora-api connection configuration
            AppInitService.knoraApiConnection = new KnoraApiConnection(AppInitService.knoraApiConfig);

            resolve();
        });
    }
}