import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { isNullOrUndefined } from 'util';
import { isUndefined } from 'util';

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.css']
})

export class RoomComponent implements OnInit {

    isPrivate = false;
    privateReceiver: string;
    roomId: string;
    msg: string;
    privMsg: string;
    msgs: string[] = [];
    users: string[];
    ops: string[];
    topic: string;
    userName: string;
    noUsers = false;
    editTopic = false;
    isOps = false;
    constructor(private chatService: ChatService, private router: Router,
              private route: ActivatedRoute, private toastrService: ToastrService) {  }

    ngOnInit() {
        this.roomId  = this.route.snapshot.params['id'];
        this.chatService.getUserName().subscribe(name => {
            if (name !== undefined) {
                this.userName = name;
            } else {
                this.router.navigate(['/login']);
            }
        });
        this.chatService.getTopic(this.roomId).subscribe(t => {
            this.topic = t;
        });
        this.chatService.getGuests().subscribe(lst => {
            //this.users = lst;
            if (this.roomId === lst[0]) {
                this.users = [];
                for (let i = 1; i < lst.length; i++) {
                    this.users.push(lst[i]);
                }
            }
        });
        this.chatService.getOps().subscribe(lst => {
            if (this.roomId === lst[0]) {
                this.ops = [];
                for (let i = 1; i < lst.length; i++) {
                    this.ops.push(lst[i]);
                }
            }
            for (let i = 0; i < lst.length; i++) {
                if (lst[i] === '(You) ' + this.userName) {
                  this.isOps = true;
                }
            }
        });
        this.chatService.updateChat().subscribe(lst => {
            if (this.roomId === lst[0]) {
                this.msgs = [];
                for (let i = 1; i < lst.length; i++) {
                    this.msgs.push(lst[i]);
                }
            }
        });
        this.chatService.wasKicked().subscribe(str => {
            if (this.userName === str) {
                this.router.navigate(['/rooms']);
                this.toastrService.success('You were a bad kitty, you got yourself kicked out of the room. Watch out, you can get banned!');
            }
        });
        this.chatService.wasBanned().subscribe(str => {
            if (this.userName === str) {
                this.router.navigate(['/rooms']);
            }
        });
    }

    onSendPrivMsg() {
        if (this.privateReceiver === '(You) ' + this.userName) {
            this.privateReceiver = this.userName;
        }
        this.chatService.sendPrivMsg(this.privateReceiver, this.privMsg).subscribe(succeeded => {
            if (succeeded === true) {
                // TODO Redirect to RoomList component!
            } else {
                console.log('fail');
            }
        });
        this.privMsg = '';
    }

    onSendMsg() {
          this.chatService.sendMsg(this.roomId, this.msg).subscribe(lst => {
              if (this.roomId === lst[0]) {
                  this.msgs = [];
                  for (let i = 1; i < lst.length; i++) {
                      this.msgs.push(lst[i]);
                  }
              }

          });
          this.msg = '';
    }

    onSetTrue(user) {
        this.isPrivate = true;
        this.privateReceiver = user;
    }

      onSetFalse() {
          this.isPrivate = false;
      }

    onLeaveRoom() {
        console.log('Success leaving room!!');
        // this.router.navigate(['/rooms']);
        this.chatService.leaveRoom(this.roomId).subscribe(succeeded => {
            console.log('Success leaving room!!');
            if (succeeded === true) {
                this.router.navigate(['/rooms']);
            }
        });
    }

    onEditTopic() {
      this.editTopic = true;
    }

    onChangeTopic() {
      this.chatService.setTopic(this.topic, this.roomId).subscribe(succeeded => {
          console.log('Success changing topic!');
      });
      this.editTopic = false;
    }


    onBanUser(user) {
      this.chatService.banUser(user, this.roomId).subscribe(succeeded => {
          console.log('Success banning user!');
      });
    }

    onKick(userName) {
      console.log('got to onkick');
      this.chatService.kick(userName, this.roomId).subscribe(succeeded => {
        console.log('b4succeeded');
        if (succeeded === true) {
          // TODO Redirect to RoomList component!
          console.log('succeeded');
        } else {
          console.log('fail');
        }
      });
      console.log('got to back');
    }

  /*  kick
    When a room creator wants to kick a user from the room.
    Parameters:
      an object containing the following properties: { user : "The username of
      the user being kicked", room: "The ID of the room"
      a callback function, accepting a single boolean parameter, stating if the
      user could be kicked or not.
    The server will emit the following events if the user was successfully
    kicked: "kicked" to the user being kicked, and "updateusers" to the rest of
    the users in the room.*/

}
