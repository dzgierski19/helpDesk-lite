import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { UserRole } from '../models/enums';

describe('AuthService', () => {
  let service: AuthService;
  let store: Record<string, string>;
  let getItemSpy: jasmine.Spy;
  let setItemSpy: jasmine.Spy;
  let removeItemSpy: jasmine.Spy;
  const storageKey = 'userRole';

  const createService = () => {
    service = TestBed.inject(AuthService);
    return service;
  };

  beforeEach(() => {
    store = {};
    TestBed.configureTestingModule({});
    getItemSpy = spyOn(window.localStorage, 'getItem').and.callFake((key: string) => {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    });
    setItemSpy = spyOn(window.localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    removeItemSpy = spyOn(window.localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });
  });

  it('should be created', () => {
    createService();
    expect(service).toBeTruthy();
  });

  it('login() should set role and save to localStorage', () => {
    createService();

    const nextSpy = jasmine.createSpy('roleSpy');
    service.currentUserRole$.subscribe(nextSpy);

    service.login(UserRole.Agent);

    expect(nextSpy).toHaveBeenCalledWith(UserRole.Agent);
    expect(setItemSpy).toHaveBeenCalledWith(storageKey, UserRole.Agent);
  });

  it('logout() should clear role and remove from localStorage', () => {
    createService();
    service.login(UserRole.Admin);

    const nextSpy = jasmine.createSpy('roleSpy');
    service.currentUserRole$.subscribe(nextSpy);

    service.logout();

    expect(nextSpy).toHaveBeenCalledWith(null);
    expect(removeItemSpy).toHaveBeenCalledWith(storageKey);
  });

  it('should load initial role from localStorage', () => {
    store[storageKey] = UserRole.Reporter;
    createService();

    expect(getItemSpy).toHaveBeenCalledWith(storageKey);
    expect(service.getSnapshotUserRole()).toBe(UserRole.Reporter);
  });
});
