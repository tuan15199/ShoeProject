import { Injectable } from '@angular/core';
import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotifyConfirm from 'pnotify/dist/es/PNotifyConfirm';

@Injectable({
  providedIn: 'root'
})
export class PnotityService {
  constructor() {
    PNotifyButtons;
    PNotifyConfirm;
    PNotify.defaults.styling = 'bootstrap4';
    PNotify.defaults.icon = 'fontawesome5';
   }

   success(title: string, content: string){
    PNotify.success({
      title,
      text: content,
      delay: 1500,
      stack: ({
        dir1: 'down', dir2: 'right', // Position from the top left corner.
        firstpos1: 20, firstpos2: 600 // 20px from the top, 400px from the left.
      })
    })
   }

   error(title: string, content: string){
    PNotify.error({
      title,
      text: content,
      delay: 1500,
      stack: ({
        dir1: 'down', dir2: 'right',
        firstpos1: 20, firstpos2: 600
      })
    })
   }

   confirm(title: string, content: string, callback: (ok: boolean) => void){
     const notice = PNotify.notice({
       title,
       text: content,
       icon: 'fa fa-question-circle',
       hide: false,
       delay: 1500,
       stack: { dirl: 'down', modal: true, firstposl: 5},
       modules: {
         Confirm: { confirm: true },
         Buttons: { closer: false, ticker: false },
         History: { history: false },
       }
     });
     notice.on('pnotify.confirm', () => {
       callback(true);
     });
     notice.on('pnotify.cancel', () => {
       callback(false);
     })
   }
}
