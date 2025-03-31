import Cookies from 'js-cookie'

class HttpUtils {

    GET = 'GET'
    POST = 'POST'
    POSTFILE = 'POSTFILE'
    PUT = 'PUT'
    DELETE = 'DELETE'
    
    get_headers = (request_type) => {
        switch(request_type) {
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
                return {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRFToken': Cookies.get('csrftoken')
                }
        }
    }
}

export default new HttpUtils()