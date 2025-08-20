import { Component, OnInit, signal } from '@angular/core';

export interface Reel {
  reelItems: Array<string>;
  isSpinning: Boolean;
  currentIndex: number | null;
  position: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('slot-machine');
  lossCounter: number = 0;
  winCounter: number = 0;
  reels: Array<Reel> = [
    {
      reelItems: [],
      isSpinning: false,
      currentIndex: null,
      position: 0,
    },
    {
      reelItems: [],
      isSpinning: false,
      currentIndex: null,
      position: 0,
    },
    {
      reelItems: [],
      isSpinning: false,
      currentIndex: null,
      position: 0,
    },
  ];

  ngOnInit(): void {
    this.fillReels();
  }

  fillReels() {
    this.reels.forEach((reel) => {
      for (let i = 0; i < 9; i++) {
        reel.reelItems.push(
          `/assets/item-${Math.floor(Math.random() * 9)}.webp`
        );
      }
    });
  }
  spin() {
    this.reels.forEach((reel, index) => {
      let newReels: Array<Array<string>> = [[], [], []];
      reel.isSpinning = true;
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          newReels[index].push(
            `/assets/item-${Math.floor(Math.random() * 9)}.webp`
          );
        }
        reel.reelItems = [...newReels[index]];
        reel.isSpinning = false;
        if (index === this.reels.length - 1) {
          this.checkResults();
        }
      }, 1000 + index * 500);
    });
  }
  checkResults() {
    if (this.checkLineEquality()) {
      const spinAudio = new Audio('/assets/slotmachine.mp3');
      spinAudio.play();
      this.winCounter++;
      if (this.lossCounter === 10) {
        this.lossCounter++;
      }
      console.log('You Won!!');
    } else {
      this.lossCounter++;
      console.log('you lost');
    }
  }
  checkLineEquality(): boolean {
    let deconstructedArrays: Array<Array<string>> = [[], [], []];
    this.reels.forEach((reel, index) => {
      for (var i = 0; i < 3; i++) {
        deconstructedArrays[i].push(reel.reelItems[i]);
      }
    });

    let isEqual: Array<boolean> = deconstructedArrays.map((array) => {
      return array.every((el) => el === array[0]);
    });

    return isEqual.some((el) => el);
  }
}
