import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { Observable, ReplaySubject, Subscription} from 'rxjs';
import { Census } from 'service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnChanges, OnDestroy {
    @Input() characterId: Observable<string>;
    profileObservable: Observable<Census.CharacterProfile>;
    private outfitObservable: Observable<Census.CharacterOutfit>;
     worldObservable: Observable<Census.World>;
    private onlineStatusObservable: Observable<Census.CharacterOnlineStatus>;
    private subscription: Subscription = new Subscription();
    private zippedObservable;
    
    get $profile()      { return this.profileObservable };
    get $outfit()       { return this.outfitObservable };
    get $world()        { return this.worldObservable };
    get $onlineStatus() { return this.onlineStatusObservable };
    get $isLoaded()     { return this.loadStatusSubject }

    private cidSubject = new ReplaySubject<string>(1);
    private loadStatusSubject = new ReplaySubject<boolean>(1);
    
    prof: Census.CharacterProfile;
    constructor( private census: Census.Service ) {
        this.profileObservable = this.cidSubject
        .flatMap( cid => this.census.getCharacterProfiles( [ cid ] ) )
        .map( profiles => profiles[0] )
        .publish()
        .refCount();

        this.outfitObservable = this.profileObservable
        .map( profile => profile.outfit )
        .publishReplay(1)
        .refCount();

        this.worldObservable = this.profileObservable
        .flatMap( profile => 　this.census.getWorlds( [ profile.world.world_id ] ) )
        .map( worlds => worlds[0] )
        .publishReplay(1)
        .refCount();
        
        this.onlineStatusObservable = this.profileObservable
        .flatMap( profile =>  this.census.getCharacterOnlineStatuses( [ profile.character_id ] ) )
        .map( onlineStatuses => onlineStatuses[0] )
        .publishReplay(1)
        .refCount();

        this.zippedObservable = Observable.zip( this.cidSubject, this.profileObservable, this.outfitObservable, this.worldObservable, this.onlineStatusObservable )
        .do( () => {
            this.loadStatusSubject.next( true );
        } ); 
        
    }

    ngOnInit() {
        this.subscription.add( this.zippedObservable.subscribe() );
    }
    
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    
    // Observable に変換する仕組み...入力値が数字と認識されると問題が起こる可能性があるので、挙動がおかしいときは数字化されていないかチェック
    ngOnChanges(changes: any) {
        this.loadStatusSubject.next( false );
        this.cidSubject.next( changes.characterId.currentValue );
    }
}
