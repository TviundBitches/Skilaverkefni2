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
  topic: string;
  userName: string;
  noUsers: boolean = false;
  editTopic: boolean = false;
  isOps: boolean = false;
  constructor(private chatService: ChatService, private router: Router,
              private route: ActivatedRoute) {  }

  ngOnInit() {
    this.roomId  = this.route.snapshot.params['id'];
    // Varud haettulegt sja  fyrirlestur 6a ca 49. Aetti ad duga samt
    this.chatService.getUserName().subscribe(name => {
        if(name !== undefined){
            this.userName = name;
        }
        else
            this.router.navigate(['/login']);
    })
    this.chatService.getTopic(this.roomId).subscribe(t => {
        this.topic = t;
    })
    this.chatService.getGuests(this.roomId).subscribe(lst => {
        this.users = lst;
    })
    this.chatService.getOps(this.roomId).subscribe(lst => {
      for (var i = 0; i < lst.length; i++) { // Var var lint error
       if(lst[i] === 'You')//this.userName)
       {
          this.isOps = true;
          break;
       }
      }
        this.ops = lst;
        console.log('lstt'+lst)
    })
    this.chatService.reciveMsg();
    this.msgs = this.chatService.updateChat();
    this.chatService.wasKicked().subscribe(str => {
      if(this.userName === str)
        this.router.navigate(['/rooms']);
    })



  }

  onSendMsg() {
    this.chatService.sendMsg(this.roomId, this.msg).subscribe(lst => {
      for (const x in lst) { // Var var lint error
      }
      this.msgs = lst;
    });
  }

  onLeaveRoom() {
      console.log('Success leaving room!!');
      //this.router.navigate(['/rooms']);
      this.chatService.leaveRoom(this.roomId).subscribe(succeeded => {
          console.log('Success leaving room!!');
          if (succeeded === true) {
              this.router.navigate(['/rooms']);
          }
      });
  }

  onVisitProfile(user) {
    this.router.navigate(['/rooms/'+this.roomId+'/users/'+user]);
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
        console.log('Success changing topic!');
    });
  }
  onKick(userName) {
    console.log('got to onkick')
    this.chatService.kick(userName, this.roomId).subscribe(succeeded => {
      console.log('b4succeeded')
      if (succeeded === true) {
        // TODO Redirect to RoomList component!
        console.log('succeeded')
      }
      else
        console.log('fail')
//      this.msgs = lst;
    });
    console.log('got to back')
  }

/*  kick
  When a room creator wants to kick a user from the room.
  Parameters:
    an object containing the following properties: { user : "The username of the user being kicked", room: "The ID of the room"
  a callback function, accepting a single boolean parameter, stating if the user could be kicked or not.
  The server will emit the following events if the user was successfully kicked: "kicked" to the user being kicked, and "updateusers" to the rest of the users in the room.*/

}
