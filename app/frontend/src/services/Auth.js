
class Auth {
    authenticated = false;
    constructor() {}

    login(callback) {
        this.authenticated = true;
        if (callback) callback();
    }

    logout(callback) {
        this.authenticated = false;
        if (callback) callback();
    }

    isAuthenticated() {
        return this.authenticated;
    }
}

export default new Auth()