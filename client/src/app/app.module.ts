import { MaterializeModule } from 'angular2-materialize';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomComponent } from './room/room.component';
import { ChatService } from './chat.service';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RoomListComponent,
        RoomComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        MaterializeModule,
        RouterModule.forRoot([{
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
        }, {
            path: 'login',
            component: LoginComponent
        }, {
            path: 'rooms',
            component: RoomListComponent
        }, {
            path: 'rooms/:id',
            component: RoomComponent
        }]),
        CommonModule,
        ToastrModule.forRoot() // ToastrModule added
    ],
    providers: [ChatService],
    bootstrap: [AppComponent]
})


export class AppModule { }
