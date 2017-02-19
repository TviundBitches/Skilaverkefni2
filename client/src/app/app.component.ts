import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})


export class AppComponent {
    title = 'KittyChats';
    underTitle = 'If you are a cat, then chat';
    logoutName = '';

    constructor(private router: Router, private toastrService: ToastrService) {
    }
    showSuccess() {
        this.toastrService.success('Hello world!', 'Toastr fun!');
    }

    navToRooms(){
        this.router.navigate(['/rooms/']);
    }

    onLogOut() {
        this.router.navigate(['/login']);
    }
}
