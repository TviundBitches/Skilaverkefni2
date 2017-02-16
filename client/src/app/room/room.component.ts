import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  roomId: string;
  msg: string;
  msgs: string[];
  users: string[];
  ops: string[];
  userName: string;
  constructor(private chatService: ChatService, private router: Router,
              private route: ActivatedRoute) {  }

  ngOnInit() {
    this.roomId  = this.route.snapshot.params['id'];
    // Varud haettulegt sja  fyrirlestur 6a ca 49. Aetti ad duga samt
    this.chatService.getUserName().subscribe(name => {
        this.userName = name;
    })
    this.chatService.getGuests(this.roomId).subscribe(lst => {
        this.users = lst;
    })
    this.chatService.getOps(this.roomId).subscribe(lst => {
        this.ops = lst;
    })
  }

  onSendMsg() {
    console.log('sending msg');
    this.chatService.sendMsg(this.roomId, this.msg).subscribe(lst => {
      for (const x in lst) { // Var var lint error
        console.log(x)
        console.log(lst[x])
      }
      this.msgs = lst;
    });
  }
  onLeaveRoom() {
      console.log('Success leaving room!!');
      this.router.navigate(['/rooms']);
    //   this.chatService.leaveRoom(this.roomId).subscribe(succeeded => {
    //       console.log('Success leaving room!!');
    //       if (succeeded === true) {
    //           console.log('hello');
    //           this.router.navigate(['/rooms']);
    //       }
    //   });
  }

  // sendmsg
  // Should get called when a user wants to send a message to a room.
  // Parameters:
  //   a single object containing the following properties: {roomName: "the room identifier", msg: "The message itself, only the first 200 chars are considered valid" }
  // The server will then emit the "updatechat" event, after the message has been accepted.

}
