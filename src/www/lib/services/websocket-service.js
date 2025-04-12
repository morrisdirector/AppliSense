import { DataService } from "./data-service";
export class WebsocketService extends DataService {
    // private pollConnectionInt?: NodeJS.Timeout;
    constructor() {
        super();
        this.url = "ws://localhost:8080";
        this.newWebSocket = () => {
            this.websocket = new WebSocket(this.url);
            return this.websocket;
        };
        this.close = () => {
            if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
                this.websocket.close();
            }
        };
        this.connect = () => {
            console.log("Attempting connection to WS...");
            const ws = this.newWebSocket();
            ws.onopen = () => {
                console.log("WS connection open");
            };
            ws.onclose = () => {
                console.log("WS connection closed");
            };
            ws.onerror = (evt) => {
                console.log("WS Error: ", evt);
            };
            return ws;
        };
        this.reconnect = () => {
            return new Promise((resolve, reject) => {
                if (!this.websocket) {
                    reject();
                }
                else {
                    let ws = this.websocket;
                    let attempts = 1;
                    const reconnectInt = setInterval(() => {
                        switch (ws.readyState) {
                            case WebSocket.CLOSED:
                                console.log("Starting reconnect...");
                                ws = this.connect();
                                break;
                            case WebSocket.CLOSING:
                                console.log("WS closing...");
                                break;
                            case WebSocket.CONNECTING:
                                console.log("WS connecting...");
                                break;
                            case WebSocket.OPEN:
                                clearInterval(reconnectInt);
                                resolve(true);
                                break;
                        }
                        if (attempts >= 30) {
                            clearInterval(reconnectInt);
                        }
                        attempts = attempts + 1;
                    }, 1000);
                }
            });
        };
        this.send = (msg) => {
            if (this.websocket) {
                switch (this.websocket.readyState) {
                    case WebSocket.OPEN:
                        if (this.DEVELOPMENT) {
                            this.websocket.send(JSON.stringify({
                                type: "echo",
                                payload: "test",
                            }));
                        }
                        else if (msg) {
                            this.websocket.send(msg);
                        }
                        break;
                    default:
                        this.reconnect();
                        break;
                }
            }
        };
        if (!this.DEVELOPMENT) {
            this.url = "ws://" + this.HOST + ":1337";
        }
        this.connect();
    }
}
