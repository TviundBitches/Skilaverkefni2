import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'KittyChats';
    underTitle = 'if you are a cat, then chat';

    constructor() {}
}
