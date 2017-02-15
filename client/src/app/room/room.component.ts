import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {

  roomId: string;
  constructor(private router: Router,
              private route: ActivatedRoute) {  }

  ngOnInit() {
      this.roomId  = this.route.snapshot.params['id'];
        // Varud haettulegt sja  fyrirlestur 6a ca 49. Aetti ad duga samt
  }

  leaveRoom() {
      this.router.navigate(['/rooms']);
  }

}
