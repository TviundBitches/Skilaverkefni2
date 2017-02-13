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

  constructor() {
    this.socket = io("http://localhost:8080/");
    this.socket.on("connect", function(){
        console.log("connect");
    });
  }
}
