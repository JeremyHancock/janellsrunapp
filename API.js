import axios from 'axios';

export default {

    getRuns: function (user) {
        console.log('getRuns was called for', user);
        return new Promise(function (resolve, reject) {
            serverRequest = axios.get('http://192.168.1.183:8080/runs?user=' + user)
                .then((response) => {
                    if (serverRequest) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject(Error('An error occured.', error))
                })
        })
    },
    postRun: function (run) {
        console.log('postRun was called', run);
        axios.post('http://192.168.1.183:8080/runs', run)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    updateRun: function (run) {
        console.log('updateRun was called', run);
        axios.update('http://192.168.1.183:8080/runs', run)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    deleteRun: function (run) {
        console.log('deleteRun was called', run);
        axios.delete('http://192.168.1.183:80080/runs', run)
            .then(function (response) {
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    signin: function (email, password) {
        console.log('signin was called for', email);
        return new Promise(function (resolve, reject) {
            serverRequest = axios.get('http://192.168.1.183:8080/usercredentials?email=' + email + '&password=' + password)
                .then((response) => {
                    if (serverRequest) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject(Error('An error occured.', error))
                })
        })
    },
    signup: function (email, password) {
        console.log('signup was called for', email);
        credentials = { 'email': email, 'password': password }
        return new Promise(function (resolve, reject) {
            serverRequest = axios.post('http://192.168.1.183:8080/usercredentials', credentials)
                .then((response) => {
                    if (serverRequest) {
                        resolve(response.data);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject(Error('An error occured.', error))
                })
        })
    }
}