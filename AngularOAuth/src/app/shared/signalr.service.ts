import { Injectable, EventEmitter } from '@angular/core';
// import { SignalRNotification } from '../models/signalrnotification';
import { environment } from '../../environments/environment';
import { SignalRChannelVariable } from './shared.model';
import { Observable } from 'rxjs';

declare var $: any;

@Injectable()
export class SignalRService {

    private proxy: any;
    private connection: any;

    public messageReceived: EventEmitter<string>;
    public connectionEstablished: EventEmitter<Boolean>;
    public connectionExists: Boolean;
    public inProgressRequestCount : number;
    private signalRChannelVariable = new SignalRChannelVariable();

    constructor() {
        this.messageReceived = new EventEmitter<string>();
        this.connectionEstablished = new EventEmitter<Boolean>();
        this.connectionExists = false;
        this.inProgressRequestCount = 0;
        //this.connection = $.hubConnection("http://ocr-api.azurewebsites.net/SignalR/Hubs");
        this.connection = $.hubConnection(environment.signalRHubSettings.baseUrl + environment.signalRHubSettings.HubUrl);
        this.proxy = this.connection.createHubProxy(this.signalRChannelVariable.channelHubName);
        this.registerOnServerEvents();
    }

    public startConnection(): void {
       /* console.log('Inside StartConnection');*/
       if (this.connectionExists === false) {
            this.connection.start().done((data: any) => {
                /* console.log('Now connected ' + data.transport.name + ', connection ID= ' + data.id);*/
                this.connectionEstablished.emit(true);
                this.connectionExists = true;
                this.inProgressRequestCount = this.inProgressRequestCount + 1 ;
            }).fail((error: any) => {
                /* console.log('Could not connect ' + error);*/
                this.connectionEstablished.emit(false);
                this.connectionExists = false;
                Observable.throw(error);
            });
       } else {
            this.inProgressRequestCount = this.inProgressRequestCount + 1 ;
       }

    }

    public registerOnServerEvents(): void {
        this.proxy.on(this.signalRChannelVariable.channelProxyMethodName, (data: string) => {
           // console.log('received in SignalRService: ' + JSON.stringify(data));
            if (this.inProgressRequestCount > 0) {
                this.inProgressRequestCount = this.inProgressRequestCount -1 ;
            }
            this.messageReceived.emit(data);
        });
    }

    public stopConnection(): void {
       /* console.log('Inside StopConnection');*/
         if (this.inProgressRequestCount === 0) {
            this.connection.stop();
            // this.connection.stop().done((data: any) => {
            //    /* console.log('Connection stopped ' + data);*/
            this.connectionExists = false;
         }
        // }).fail((error: any) => {
        //    /* console.log('Could not stop ' + error);*/
        //     Observable.throw(error);
        // });

    }

}

