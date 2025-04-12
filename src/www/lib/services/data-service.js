export class DataService {
    constructor() {
        this.DEVELOPMENT = process.env.NODE_ENV === "development";
        this.HOST = document.location.host;
    }
    jsonGET(path) {
        return fetch(path).then(function (response) {
            return response.json();
        });
    }
    jsonPOST(path, dto) {
        return fetch(path, {
            method: "post",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
            },
            body: (dto && JSON.stringify(dto)) || "",
        }).then((res) => res.json());
    }
    emptyPOST(path) {
        return fetch(path, {
            method: "post",
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "text/plain",
            },
        }).then((res) => res.json());
    }
}
