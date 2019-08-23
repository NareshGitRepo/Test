// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { PlayerService } from '../../services/studio/studio.service';

// @Component({
//   templateUrl: 'studio.component.html',
// })

// export class StudioComponent implements OnInit, OnDestroy {

//   private song: Song;
//   private currentTime: string;
//   private fullTime: string;
//   private isPlaying: boolean;
//   // Subscription variables
//   private songSubscription: any;
//   private currentTimeSubscription: any;
//   private fullTimeSubscription: any;

//   ngOnDestroy(): void {
//     this.songSubscription.unsubscribe();
//     this.currentTimeSubscription.unsubscribe();
//     this.fullTimeSubscription.unsubscribe();
//     console.log("Player subscription destroyed");
//   }

//   constructor(private _playerService: PlayerService) { }

//   ngOnInit() {

//     this.songSubscription = this._playerService.song.subscribe(data => this.song = data);
//     this.currentTimeSubscription = this._playerService.currentTime.subscribe(data => this.currentTime = data);
//     this.fullTimeSubscription = this._playerService.fullTime.subscribe(data => this.fullTime = data);
//     console.log("Player subscription initialized");

//   }

//   toggleAudio() {
//     this.isPlaying = this._playerService.toggleAudio();
//   }

// }
