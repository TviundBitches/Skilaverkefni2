import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'KittyChats';
    underTitle = 'If you are a cat, then chat';
    logoutName = '';

    constructor(private router: Router) {}

    navToRooms(){
        this.router.navigate(['/rooms/']);
    }

    onLogOut() {
        this.router.navigate(['/login']);
    }
}
