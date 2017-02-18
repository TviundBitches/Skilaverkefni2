import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChatService {
	socket: any;
	userName: string;
	private loggedIn = false;


	constructor() {
		this.socket = io('http://localhost:8080/');
		this.socket.on('connect', function () {
			console.log('connect');
		});

	}

	reciveMsg() {
    this.socket.on('recv_privatemsg', (username, message) => {
      console.log("rect-priv: " + username)
      console.log('rect-priv ' + message)
    });

  }

	login(userName: string): Observable<boolean> {
		let observable = new Observable(observer => {
			this.socket.emit('adduser', userName, succeeded => {
				observer.next(succeeded);
				this.loggedIn = true;
			});
		});

		return observable;
	}

	// logout() {
	//
	// }

	isLoggedIn() {
		return this.loggedIn;
	}

	setUserName(userName: string) : any {
		this.userName = userName;
	}

	getUserName() : Observable<string> {
		let obs = new Observable(observer => {
			observer.next(this.userName);
		});
		return obs;
	}

	getRoomList(): Observable<string[]> {
		let obs = new Observable(observer => {
			this.socket.emit('rooms');
			this.socket.on('roomlist', (lst) => {
				let strArr: string[] = [];
				for (const x in lst) { // Var var lint error
					strArr.push(x);
				}
				observer.next(strArr);
			});
		});

		return obs;
	}

	// List of all users
	getUserList(): Observable<string[]> {
		let obs = new Observable(observer => {
			this.socket.emit('users');
			this.socket.on('userlist', (lst) => {
				let strArr: string[] = [];
				for (var i = 0; i < lst.length; i++) { // Var var lint error
					if(this.userName !== lst[i])
						strArr.push(lst[i]);
					else
						strArr.push("You");
		        }
				observer.next(strArr);
			});
		});

		return obs;
	}

	// updateUsers(roomId): Observable<string[]> {
	// 	let obs = new Observable(observer => {
	// 		this.socket.emit('updateUsers')
	// 	})
	// }

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

	getGuests(roomName: string): Observable<string[]> {
		let obs = new Observable(observer => {
			const param = {
				room: roomName
			};
			this.socket.emit('updateroom', param);
			this.socket.on('updateusers', (roomName, lstUsers, lstOps) => {
			  let strArr: string[] = [];
			  for(const user in lstUsers) { // Var var lint error
				  if(user !== this.userName)
					strArr.push(user);
				  else
					strArr.push("You");
	          }
	          observer.next(strArr);
			});
		});
		return obs;
	}

	getOps(roomName: string): Observable<string[]> {
		let obs = new Observable(observer => {
			const param = {
				room: roomName
			};
			this.socket.emit('updateroom', param);
			this.socket.on('updateusers', (roomName, lstUsers, lstOps) => {
			  let strArr: string[] = [];
			  for(const user in lstOps) { // Var var lint error
				  if(user !== this.userName)
					strArr.push(user);
				  else
				  	strArr.push("You");

	          }
	          observer.next(strArr);
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
			// validate room name
			const param = { // Same
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
    let obs = new Observable(observer => {
      // validate room name
      const param = {
        roomName: roomName,
        msg: msg
      };
      this.socket.emit('sendmsg', param);
      this.socket.on('updatechat', (roomName, lst) => {
        let strArr: string[] = [];
        for (var i = 0; i < lst.length; i++) { // Var var lint error
          strArr.push(lst[i].message);
        }
        observer.next(strArr);
      });

    });
    return obs;
  }

  updateChat(): string[] {
	  console.log('smuu')
    let strArr: string[] = [];
      this.socket.on('updatechat', (roomName, lst) => {
        console.log(roomName)
       // console.log(lst)
        for (var i = 0; i < lst.length; i++) { // Var var lint error
          strArr.push(lst[i].message);
        }
        return strArr;
      });
    return strArr;
  }

  sendPrivMsg(userName: string, msg: string): Observable<boolean> {
    let obs = new Observable(observer => {
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
  /*
   privatemsg
   Used if the user wants to send a private message to another user.
   Parameters:
   an object containing the following properties: {nick: "the userid which the message should be sent to", message: "The message itself" }
   a callback function, accepting a single boolean parameter, stating if the message could be sent or not.
   The server will then emit the "recv_privatemsg" event to the user which should receive the message.*/


}
