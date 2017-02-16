import { Component, OnInit, EventEmitter  } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import {MaterializeAction} from 'angular2-materialize';

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.css']
})
export class RoomListComponent implements OnInit {

    newRoomName: string;
    roomJoinName: string;
    userName: string;
    rooms: string[];
    users: string[];
    modalActions = new EventEmitter<string|MaterializeAction>();
    constructor(private chatService: ChatService,
          private router: Router) { }

    ngOnInit() {
        this.chatService.getRoomList().subscribe(lst => {
            this.rooms = lst;
        });
        this.chatService.getUserName().subscribe(name => {
            this.userName = name;
        });
<<<<<<< HEAD
        this.chatService.getUserList().subscribe(lst => {
            this.users = lst;
        });
=======
        this.chatService.reciveMsg();
>>>>>>> 775b270c5e8ebd640b390ce51d05416a87c77c0b
    }

    onNewRoom() {
        if (this.newRoomName.length < 1) {
            return;
        }
        this.chatService.addRoom(this.newRoomName).subscribe(succeeded => {
            if (succeeded === true) {
                this.router.navigate(['rooms', this.newRoomName]);

            }
        });
          // this.newRoomName = "";
    }

    onJoinRoom(roomName) {
        this.chatService.joinRoom(roomName).subscribe(succeeded => {
            console.log("success join room");
            if (succeeded === true) {
                this.router.navigate(['rooms', roomName]);
            }

        });
          // this.newRoomName = "";
    }

<<<<<<< HEAD

    openModal() {
      this.modalActions.emit({action:"modal",params:['open']});
    }
    closeModal() {
      this.modalActions.emit({action:"modal",params:['close']});
=======
    onVisitProfile(user) {
      this.router.navigate(['/rooms/default/users/'+user]);
>>>>>>> 775b270c5e8ebd640b390ce51d05416a87c77c0b
    }

}
