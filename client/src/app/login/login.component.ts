import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    userName: string;
    loginFailed = false;

    constructor(private chatService: ChatService,
        private router: Router, private appComponent: AppComponent) {

    }

    ngOnInit() {
        this.appComponent.logoutName = '';
    }

    onLogin() {
        this.chatService.login(this.userName).subscribe(succeeded => {
            this.loginFailed = !succeeded;
            if (succeeded === true) {
                this.chatService.setUserName(this.userName);
                this.router.navigate(['/rooms']);

                // TODO Redirect to RoomList component!
            }
        });
    }

}
