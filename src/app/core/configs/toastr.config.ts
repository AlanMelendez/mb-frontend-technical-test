import { IndividualConfig } from 'ngx-toastr';

export const toastrGlobalConfig: Partial<IndividualConfig<any>> = {  
 timeOut: 3000,
 positionClass: 'toast-bottom-center',
 closeButton: true,
 progressBar: true,
 progressAnimation: 'decreasing', 
};