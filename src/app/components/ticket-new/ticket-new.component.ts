import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { SharedService } from 'src/app/services/shared.service';
import { ResponseApi } from 'src/app/model/response-api';
import { Ticket } from 'src/app/model/ticket.model';



@Component({
  selector: 'app-ticket-new',
  templateUrl: './ticket-new.component.html',
  styleUrls: ['./ticket-new.component.css']
})
export class TicketNewComponent implements OnInit {

  @ViewChild("form")
  form: NgForm;

  ticket = new Ticket('',0,'','','','', null,null,'',null,'');
  shared: SharedService;
  message: {};
  classCss: {};

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute
  ) {
    this.shared = SharedService.getInstance();
  }

  ngOnInit() {
    let id: string = this.route.snapshot.params['id'];
    if(id != undefined) {
      this.findById(id);
    }
  }

  findById(id:string) {
    this.ticketService.findById(id).subscribe((responseApi: ResponseApi) => {
      this.ticket = responseApi.data;
    }, err => {
      this.showMessage({
        type: 'error',
        text: err.error['message']
      });
    });
  }

  register() {
    this.message = {};
    this.ticketService.createOrUpdate(this.ticket).subscribe((responseApi: ResponseApi) => {
      this.ticket = new Ticket('',0,'','','','', null,null,'',null,'');
      let ticketRet : Ticket= responseApi.data;
      this.form.resetForm();
      this.showMessage({
        type: 'success',
        text: 'Registered ${ticketRet.title} successfully'
      });
    }, err => {
      this.showMessage({
        type: 'error',
        text: err.error['message']
      });
    });
  }

  onFileChange(event): void {
    if (event.target.files[0].size > 2000000) {
      this.showMessage({
        type: 'error',
        text: 'Tamanho máximo de arquivo excedido'
      });
    } else {
      this.ticket.image = '';
      const reader = new FileReader();
      reader.onloadend = (e: Event) => {
        this.ticket.image = reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  private showMessage(message: {type: string, text: string}) : void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => {
      this.message = undefined;
    }, 3000);
  }

  private buildClasses(type: string): void {
    this.classCss = {
      'alert': true
    }
    this.classCss['alert-'+type] = true;
  }

  getFormGroupClass(isInvalid: boolean, isDirty) {
    return {
      'form-group': true,
      'has-error': isInvalid && isDirty,
      'has-success': !isInvalid && isDirty
    };
  }

}
