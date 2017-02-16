import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

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
    constructor(private chatService: ChatService,
          private router: Router) { }

    ngOnInit() {
        this.chatService.getRoomList().subscribe(lst => {
            this.rooms = lst;
        });
        this.chatService.getUserList().subscribe(lst => {
            this.users = lst;
        });
        this.chatService.getUserName().subscribe(name => {
            this.userName = name;
        });
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
        console.log(roomName);
        this.chatService.joinRoom(roomName).subscribe(succeeded => {
            if (succeeded === true) {
                this.router.navigate(['rooms', roomName]);

            }
        });
          // this.newRoomName = "";
    }

}
