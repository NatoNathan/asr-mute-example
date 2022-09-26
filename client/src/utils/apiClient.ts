const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'http://localhost:5001'

const apiRequest = (path:string, method: 'GET' | 'POST' |'PUT'='GET', data?: object) => {
    return fetch(`${SITE_URL}/${path}`, {
      method: method,
      body: data? JSON.stringify(data): undefined,
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
};

export default apiRequest;