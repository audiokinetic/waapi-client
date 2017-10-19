/*
Copyright 2017 Audiokinetic Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import * as autobahn from 'autobahn';

export class Session {

    session:autobahn.Session;
    connection:autobahn.Connection;

    constructor(session:autobahn.Session, connection:autobahn.Connection){
        this.session = session;
        this.connection = connection;
    }

    /** call a function using wamp RPC */
    call(uri: string, args: any, options?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.session.call(uri, [], args, options).then(
                function (res) {
                    resolve(res ? (<any>res).kwargs: null);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    }

    /** subscribe to topic */
    subscribe(topic: string, subscribeHandler: autobahn.SubscribeHandler, options: any): Promise<autobahn.ISubscription> {
        return new Promise((resolve, reject) => {
            var self = this;
            this.session.subscribe(topic, subscribeHandler, options).then(
                function (res) {
                    resolve(res);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    }

    /** unsubscribe to topic */
    unsubscribe(subscription: autobahn.ISubscription): Promise<any> {
        return new Promise((resolve, reject) => {
            this.session.unsubscribe(subscription).then(
                function (res) {
                    resolve(null);
                },
                function (error) {
                    reject(error);
                }
            );
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.session.isOpen) {
                this.session.onleave = function (reason, details) {
                    resolve();
                };

                this.connection.close();
                
                this.connection = null;
                this.session = null;
            } else {
                reject();
            }
        });
    }
}

export function connect(host: string): Promise<Session> {
    return new Promise((resolve, reject) => {
        var connection = new autobahn.Connection(
            { 
                url: host, 
                realm: 'realm1',
                protocols: ['wamp.2.json'],
            });

        connection.onclose = function (reason, details): boolean {
            reject(new Error(`Session closed: ${reason}`));
            return true;
        };
        connection.onopen = function (session) {
            connection.onclose = null;
            resolve(new Session(session, connection));
        };

        connection.open();
    });
}
