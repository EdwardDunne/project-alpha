import Cookies from 'js-cookie'

type RequestType = 'GET' | 'POST' | 'POSTFILE' | 'PUT' | 'DELETE';

interface Headers {
    'Accept': string;
    'Content-Type': string;
    'X-CSRFToken'?: string;
    [key: string]: string | undefined;
}

class HttpUtils {

    GET = 'GET'
    POST = 'POST'
    POSTFILE = 'POSTFILE'
    PUT = 'PUT'
    DELETE = 'DELETE'

    get_headers = (request_type: RequestType): Headers => {
        switch (request_type) {
            case this.GET:
                return {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            case this.POST:
                return {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            case this.POSTFILE:
                return {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            case this.PUT:
            case this.DELETE:
                return {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
            default:
                return {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
        }
    }
}

export default new HttpUtils()
