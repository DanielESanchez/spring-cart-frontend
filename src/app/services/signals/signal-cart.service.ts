import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalCartService {

  constructor() { }

  private signal = new Subject<Number>();

  emitSignal(data: Number) {
    this.signal.next(data);
  }

  getSignal() {
    return this.signal.asObservable();
  }
}
