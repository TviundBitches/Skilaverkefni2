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
  constructor(private chatService: ChatService, private router: Router,
              private route: ActivatedRoute) {  }

  ngOnInit() {
      this.roomId  = this.route.snapshot.params['id'];
        // Varud haettulegt sja  fyrirlestur 6a ca 49. Aetti ad duga samt
        this.chatService.getUserList().subscribe(lst => {
            console.log(lst);
            this.users = lst;
        })
      this.chatService.reciveMsg();
      this.msgs = this.chatService.updateChat();
  }

  onSendMsg() {
    this.chatService.sendMsg(this.roomId, this.msg).subscribe(lst => {
      for (const x in lst) { // Var var lint error
      }
      this.msgs = lst;
    });
  }

  onVisitProfile(user) {
    this.router.navigate(['/rooms/'+this.roomId+'/users/'+user]);
  }

  onKick(userName) {
    this.chatService.kick(userName, this.roomId);

  }

/*  kick
  When a room creator wants to kick a user from the room.
  Parameters:
    an object containing the following properties: { user : "The username of the user being kicked", room: "The ID of the room"
  a callback function, accepting a single boolean parameter, stating if the user could be kicked or not.
  The server will emit the following events if the user was successfully kicked: "kicked" to the user being kicked, and "updateusers" to the rest of the users in the room.*/

  leaveRoom() {
      this.router.navigate(['/rooms']);
  }
}
