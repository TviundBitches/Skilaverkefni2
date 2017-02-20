import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class ChatService {
    socket: any;
    userName: string;
    opRooms: string[];
    privateMessageHistory: any = {};

    constructor(private router: Router) {
        this.socket = io('http://localhost:8080/');
        this.socket.on('connect', function () {
            console.log('connect');
        });
    }

    reciveMsg(): Observable<string[]> {
        const observable = new Observable(observer => {
            this.socket.on('recv_privatemsg', (username, message) => {
                const strArr: string[] = [];
                strArr.push(username);
                strArr.push(message);
                observer.next(strArr);
            });
        });
        return observable;
    }

    wasKicked(): Observable<string> {
        const observable = new Observable(observer => {
            this.socket.on('kicked', (room, user, username) => {
                observer.next(user);
            });
        });
        return observable;
    }

    wasBanned(): Observable<string> {
        const observable = new Observable(observer => {
            this.socket.on('banned', (room, user, username) => {
                observer.next(user);
            });
        });
        return observable;
    }

    login(userName: string): Observable<boolean> {
        const observable = new Observable(observer => {
            this.socket.emit('adduser', userName, succeeded => {
                observer.next(succeeded);
            });
        });
        return observable;
    }

    setUserName(userName: string): any {
        if (userName !== undefined) {
            this.userName = userName;
        } else {
            this.router.navigate(['/login']);
        }
    }

    getUserName(): Observable<string> {
        const obs = new Observable(observer => {
            observer.next(this.userName);
        });
        return obs;
    }

    getRoomList(): Observable<string[]> {
        const obs = new Observable(observer => {
            this.socket.emit('rooms');
            this.socket.on('roomlist', (lst) => {
                const strArr: string[] = [];
                for (const x in lst) {
                    if (x !== undefined) {
                        strArr.push(x);
                    }
                }
                observer.next(strArr);
            });
        });
        return obs;
    }

    // List of all users
    getUserList(): Observable<string[]> {
        const obs = new Observable(observer => {
            this.socket.emit('users');
            this.socket.on('userlist', (lst) => {
                const strArr: string[] = [];
                for (let i = 0; i < lst.length; i++) {
                    if (this.userName !== lst[i]) {
                        strArr.push(lst[i]);
                    } else {
                        strArr.push('(You) ' + this.userName);
                    }
                }
                observer.next(strArr);
            });
        });
        return obs;
    }

    getGuests(): Observable<string[]> {
        const obs = new Observable(observer => {
            this.socket.on('updateusers', (roomName, lstUsers, lstOps) => {
                const strArr: string[] = [];
                strArr[0] = roomName;
                for (const user in lstUsers) {
                    if (user !== this.userName) {
                        strArr.push(user);
                    } else {
                        strArr.push('(You) ' + this.userName);
                    }
                }
                observer.next(strArr);
            });
        });
        return obs;
    }

    getOps(): Observable<string[]> {
        const obs = new Observable(observer => {
            this.socket.on('updateusers', (roomName, lstUsers, lstOps) => {
                const strArr: string[] = [];
                strArr[0] = roomName;
                for (const user in lstOps) {
                    if (user !== this.userName) {
                        strArr.push(user);
                    } else {
                        strArr.push('(You) ' + this.userName);
                    }
                }
                observer.next(strArr);
            });
        });
        return obs;
    }

    updateChat(): Observable<string[]> {
        const obs = new Observable(observer => {
            this.socket.on('updatechat', (roomName, lst) => {
                const strArr: string[] = [];
                strArr[0] = roomName;
                if (lst.length !== 0) {
                    for (let i = 0; i < lst.length; i++) { // Var var lint error
                        strArr.push(lst[i].message);
                    }
                }
                observer.next(strArr);
            });
        });
        return obs;
    }

    joinRoom(roomName: string): Observable<boolean> {
        const obs = new Observable(observer => {
            const param = { // Same
                room: roomName
            };
            this.socket.emit('joinroom', param, function (a: boolean, b) {
                if (a === true) {
                    observer.next(a);
                }
            });
        });
        return obs;
    }


    leaveRoom(roomName: string): Observable<boolean> {
        const obs = new Observable(observer => {
            this.socket.emit('partroom', roomName, succeeded => {
                observer.next(succeeded);
            });
        });
        return obs;
    }

    addRoom(roomName: string): Observable<boolean> {
        const observable = new Observable(observer => {
            const param = {
                room: roomName
            };
            this.socket.emit('joinroom', param, function (a: boolean, b) {
                if (a === true) {
                    observer.next(a);
                }
            });
        });
        return observable;
    }

    sendMsg(roomName: string, msg: string): Observable<string[]> {
        const obs = new Observable(observer => {
            const param = {
                roomName: roomName,
                msg: msg
            };
            this.socket.emit('sendmsg', param);
            this.socket.on('updatechat', (room, lst) => {
                const strArr: string[] = [];
                strArr.push(room);
                for (let i = 0; i < lst.length; i++) {
                    strArr.push(lst[i].message);
                }
                observer.next(strArr);
            });
        });
        return obs;
    }

    sendPrivMsg(userName: string, msg: string): Observable<boolean> {
        const obs = new Observable(observer => {
            const param = {
                nick: userName,
                message: msg
            };
            this.socket.emit('privatemsg', param, succeeded => {
                observer.next(succeeded);
            });
        });
        return obs;
    }

    kick(userName, roomId): Observable<boolean> {
        const obs = new Observable(observer => {
            const param = {
                user: userName,
                room: roomId
            };
            this.socket.emit('kick', param, succeeded => {
                observer.next(succeeded);
            });
        });
        return obs;
    }

    makeOp(userName, roomId) : Observable<boolean> {
        const obs = new Observable(observer => {
            const param = {
                user: userName,
                room: roomId
            };
            this.socket.emit('op', param, succeeded => {
                observer.next(succeeded);
            });
        });
        return obs;
    }

    setTopic(topic: string, roomName: string): Observable<boolean> {
        const obs = new Observable(observer => {
            const param = {
                topic: topic,
                room: roomName
            };
            this.socket.emit('settopic', param, succeeded => {
                console.log(succeeded);
                console.log('Succeeded set topic!');
                observer.next(succeeded);
            });
        });
        return obs;
    }

    getTopic(roomName: string): Observable<string> {
        const obs = new Observable(observer => {
            const param = {
                room: roomName
            };
            this.socket.on('updatetopic', (room, topic, username) => {
                observer.next(topic);
            });
        });
        return obs;
    }

    banUser(userName: string, roomName: string): Observable<boolean> {
        const obs = new Observable(observer => {
            const param = {
                user: userName,
                room: roomName
            };
            this.socket.emit('ban', param, succeeded => {
                observer.next(succeeded);
            });
        });
        return obs;
    }
}
