import { HttpInterceptorFn } from '@angular/common/http';

export const mainInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('token');

  // Si existe token en local storage, lo añadimos a la cabecera de todas las peticiones 
  if(token) {
    req = req.clone({
      setHeaders: {
        'Authorization': token
      }
    })
  }  
  return next(req);
};

