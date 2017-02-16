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
  constructor(private chatService: ChatService,
              private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.userName  = this.route.snapshot.params['id'];
  }

}
