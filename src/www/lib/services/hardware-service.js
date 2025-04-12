import { WebsocketService } from "./websocket-service";
export class HardwareService extends WebsocketService {
    constructor() {
        super();
        this.restart = () => {
            return new Promise((resolve, reject) => {
                if (this.DEVELOPMENT) {
                    resolve(true);
                    return;
                }
                this.emptyPOST("restart")
                    .then(() => {
                    resolve(true);
                })
                    .catch((e) => {
                    reject(e);
                });
            });
        };
        this.eraseAll = () => {
            this.send("erase");
        };
    }
}
