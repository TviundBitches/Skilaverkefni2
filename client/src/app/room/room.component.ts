import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {isNullOrUndefined} from "util";
import {isUndefined} from "util";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  roomId: string;
  msg: string;
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
    this.chatService.getGuests(this.roomId).subscribe(lst => {
        this.users = lst;
    });
    this.chatService.getOps(this.roomId).subscribe(lst => {
        this.ops = lst;
    })
    this.chatService.reciveMsg();

    this.chatService.updateChat().subscribe(lst => {
        if(this.roomId === lst[0])
        {
            this.msgs = [];
            for (let i = 1; i < lst.length; i++)
                this.msgs.push(lst[i]);
            console.log('this.mesgs: ' + this.msgs);
        }
    });
      // if(this.msgsCheck[0] === this.roomId)
      //     this.msgs.push(this.msgsCheck[this.msgsCheck.length-1]);



    this.chatService.wasKicked().subscribe(str => {
      if (this.userName === str) {
          this.router.navigate(['/rooms']);
          this.toastrService.success('You were a bad kitty, you got yourself kicked out of the room. Watch out, you can get banned!');
      }
    });
    this.chatService.wasBanned().subscribe(str => {
      if(this.userName === str)
        this.router.navigate(['/rooms']);
    })
    this.chatService.reciveMsg();
  }

  onSendMsg() {
    this.chatService.sendMsg(this.roomId, this.msg).subscribe(lst => {
        console.log('roomid: ' + this.roomId + 'lst[0]'+lst[0]);
      if(this.roomId === lst[0]) {
          this.msgs = [];
          for (let i = 1; i < lst.length; i++)
              this.msgs.push(lst[i]);
      }

    });
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

  onVisitProfile(user) {
    this.router.navigate(['/rooms/' + this.roomId + '/users/' + user]);
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
