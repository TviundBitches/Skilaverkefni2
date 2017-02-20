import { Component, OnInit  } from '@angular/core';
import { ChatService } from '../app/chat.service'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
    title = 'KittyChats';
    underTitle = 'If you are a cat, then chat';
    logoutName = '';

    constructor(private chatService: ChatService, private router: Router, private toastrService: ToastrService) {
    }
    ngOnInit() {
        this.chatService.reciveMsg().subscribe(lst => {
            //this.toastrService.success('You\'ve got mail!');
            this.toastrService.success(lst[0] +' says: '+lst[1]);
        });
    }


    navToRooms() {
        this.router.navigate(['/rooms/']);
    }

    onLogOut() {
        this.router.navigate(['/login']);
    }
}
