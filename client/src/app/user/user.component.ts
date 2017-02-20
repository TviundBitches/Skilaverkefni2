import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userName: string;
  roomName: string;
  msgSent: boolean;
  msg: string;
  msgs: string[] = [];
  constructor(private chatService: ChatService, private router: Router,
              private route: ActivatedRoute) {  }

  ngOnInit() {
    this.userName  = this.route.snapshot.params['id'];
    this.roomName  = this.route.snapshot.params['roomId'];
    this.msgSent = false;
    this.chatService.getUserName().subscribe(name => {
      if (name !== undefined) {
        // this.userName = name;
      } else {
        this.router.navigate(['/login']);
      }
    });
    // this.toastrService.success('You got mail');
    this.chatService.reciveMsg().subscribe(lst => {
      if (this.userName === lst[0]) {
        console.log('you got mail');
      }
        // this.toastrService.success('You got mail');
    });
  }

  backToRoom() {
    if (this.roomName === 'default') {
      this.router.navigate(['/rooms']);
    } else {
      this.router.navigate(['/rooms/' + this.roomName]);
    }
  }

  onSendPrivMsg() {
    console.log('uuser name in func' + this.userName);
    console.log('message' + this.msg);
    console.log('roomname' + this.roomName);
    this.chatService.sendPrivMsg(this.userName, this.msg).subscribe(succeeded => {
      if (succeeded === true) {
        // TODO Redirect to RoomList component!
      } else {
        console.log('fail');
      }
//      this.msgs = lst;
    });
  }
}
