import { HttpInterceptorFn } from '@angular/common/http';

export const userRoleInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
