import { Component } from '@angular/core';
import * as io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  socket : any;
  userName: string;
  loginFailed: boolean = false;

  constructor() {
    this.socket = io("http://localhost:8080/");
    this.socket.on("connect", function(){
        console.log("connect");
    });
  }

  onLogin() {
    this.socket.emit("adduser", this.userName, succeeded => {
        if(!succeeded) {
            this.loginFailed = true;
        }
        else {
            console.log("Login succeeded!");
        }
    });
  }
}
