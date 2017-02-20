import { Component, OnInit, EventEmitter  } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import {MaterializeAction} from 'angular2-materialize';
import { AppComponent } from '../app.component';

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
    login: string[];
    privMsg: string;
    privateMsg = false;
    privateReceiver: string;
    modalActions = new EventEmitter<string|MaterializeAction>();
    constructor(private chatService: ChatService,
          private router: Router, private appComponent: AppComponent) { }

    ngOnInit() {
        this.chatService.getRoomList().subscribe(lst => {
            this.rooms = lst;
        });
        this.chatService.getUserName().subscribe(name => {
            if (name !== undefined) {
                this.userName = name;
            } else {
                this.router.navigate(['/login']);
            }
        });
        this.chatService.getUserList().subscribe(lst => {
            this.users = lst;
        });
        this.appComponent.logoutName = 'Log Out';
    }
    onSetTrue(user) {
        this.privateMsg = true;
        this.privateReceiver = user;
    }

    onSetFalse() {
        this.privateMsg = false;
    }

    onSendPrivMsg() {
        if (this.privateReceiver === '(You) '+this.userName) {
            this.privateReceiver = this.userName;
        }
        this.chatService.sendPrivMsg(this.privateReceiver, this.privMsg).subscribe(succeeded => {
            if (succeeded === true) {
                // TODO Redirect to RoomList component!
            } else {
                console.log('fail');
            }
//      this.msgs = lst;
        });
        this.privMsg = '';
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
            console.log('success join room');
            if (succeeded === true) {
                this.router.navigate(['rooms', roomName]);
            }
        });
          // this.newRoomName = "";
    }

    openModal() {
        this.modalActions.emit({action: 'modal', params: ['open']});
    }
    closeModal() {
        this.modalActions.emit({action: 'modal', params: ['close']});
    }

}
