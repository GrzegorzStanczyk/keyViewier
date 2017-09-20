import { Injectable, OnDestroy } from '@angular/core';

import { Key } from './key/key.model';

import { Subscription } from 'rxjs/Subscription';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AuthService } from './auth/auth.service';


@Injectable()
export class DataStorageService implements OnDestroy {
  items: FirebaseListObservable<any>;
  keys: Promise<Key[]> | null = null;

  userId: Subscription;
  userState: Subscription;

  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService) {
      this.userId = this.authService.userId$.subscribe(userId => {
        this.items = this.db.list('/users/' + userId, { preserveSnapshot: true });
      });
      this.userState = this.authService.logOutSource$.subscribe(userId => {
        // Unsubscribe from listening route
        this.items.$ref.off()
      });
  }

  storeKey(key: Key) {
    const newKey = new Key(key.streetName, key.lat, key.lng, key.radius, key.key, key.note);
    const properStreetName = key.streetName.split(/\.|#|\$|\[|]|\\/gm).join(",").trim();
    this.items.update(properStreetName, newKey);

    // this.items.remove();
     // KEYS.forEach(element => {
     //   const properStreetName = element.streetName.split(/\.|#|\$|\[|]/gm).join(",");
     //   const toSend = this.db.object(`/users/${this.id}/${properStreetName}`);
     //   toSend.set(element);
     //   // this.items.push(element)
     // });

       // this.items.remove();
     // KEYS.forEach(element => {
     //   let toSend = this.db.object(`/users/${this.userId}/${element.streetName}`);
     //   const properStreetName = element.streetName.split(/\.|#|\$|\[|]/gm).join(",");
     //   this.items.update(properStreetName, element);
     // });
  }

  getKeys(): Promise<Key[]> {
    return new Promise(resolve => {
        this.items
        .subscribe(items => {
          this.keys = items.map(item => {
            let key = item.val();
            key.$key = item.key;
            return key;
          })
          resolve(this.keys)
        })
    })
  }

  deleteKey(key: Key) {
    this.items.remove(key.streetName.trim());
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.userId.unsubscribe();
    this.userState.unsubscribe();
  }
}

