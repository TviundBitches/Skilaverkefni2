import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ChatService {
	socket: any;

	constructor() {
		this.socket = io('http://localhost:8080/');
		this.socket.on('connect', function () {
			console.log('connect');
		});
	}

	login(userName: string): Observable<boolean> {
		let observable = new Observable(observer => {
			this.socket.emit('adduser', userName, succeeded => {
				console.log('Reply received');
				observer.next(succeeded);
			});
		});

		return observable;
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
        console.log(lst)
        let strArr: string[] = [];
        for (var i = 0; i < lst.length; i++) { // Var var lint error
          strArr.push(lst[i].message);
        }
        observer.next(strArr);
      });
    });
    return obs;
  }

  sendPrivMsg(userName: string, msg: string): Observable<boolean> {
    let obs = new Observable(observer => {
      // validate room name
      const param = {
        nick: userName,
        message: msg
      };
      this.socket.emit('privatemsg', param, function (a: boolean, b) {
        if (a === true) {
          observer.next(a);
        }
     });
    });
    console.log(obs)
    return obs;
  }
  /*
   privatemsg
   Used if the user wants to send a private message to another user.
   Parameters:
   an object containing the following properties: {nick: "the userid which the message should be sent to", message: "The message itself" }
   a callback function, accepting a single boolean parameter, stating if the message could be sent or not.
   The server will then emit the "recv_privatemsg" event to the user which should receive the message.*/

//
//   var socket = io();
//   $('form').submit(function(){
//   socket.emit('chat message', $('#m').val());
//   $('#m').val('');
//   return false;
// });
//   socket.on('chat message', function(msg){
//   $('#messages').append($('<li>').text(msg));
// });
	// sendmsg
	// Should get called when a user wants to send a message to a room.
	// Parameters:
	//   a single object containing the following properties: {roomName: "the room identifier", msg: "The message itself, only the first 200 chars are considered valid" }
	// The server will then emit the "updatechat" event, after the message has been accepted.

}
