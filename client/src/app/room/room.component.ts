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
  constructor(private chatService: ChatService, private router: Router,
              private route: ActivatedRoute) {  }

  ngOnInit() {
      this.roomId  = this.route.snapshot.params['id'];
        // Varud haettulegt sja  fyrirlestur 6a ca 49. Aetti ad duga samt
  }

  onSendMsg() {
    console.log('sending msg');
    this.chatService.sendMsg(this.roomId, this.msg).subscribe(succeeded => {
      console.log('Success!!');
      //this.loginFailed = !succeeded;
     // if (succeeded === true) {
      //  this.router.navigate(['/rooms']);
        // TODO Redirect to RoomList component!
      //}
    });
  }


  // sendmsg
  // Should get called when a user wants to send a message to a room.
  // Parameters:
  //   a single object containing the following properties: {roomName: "the room identifier", msg: "The message itself, only the first 200 chars are considered valid" }
  // The server will then emit the "updatechat" event, after the message has been accepted.

  leaveRoom() {
      this.router.navigate(['/rooms']);
  }
}
