import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userName: string;
  roomName: string;
  msg: string;
  constructor(private chatService: ChatService,
              private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.userName  = this.route.snapshot.params['id'];
    this.roomName  = this.route.snapshot.params['roomId'];
    console.log(this.userName)
    console.log(this.roomName)
  }

  backToRoom() {
    this.router.navigate(['/rooms/'+this.roomName]);
  }

  onSendPrivMsg() {
    this.chatService.sendPrivMsg(this.userName, this.msg).subscribe(succeeded => {
      console.log('Success!!');
//      this.msgs = lst;
    });
  }
}

