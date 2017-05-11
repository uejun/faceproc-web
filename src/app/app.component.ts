import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
    currentStyles = {};

    constructor(private router: Router) {
        this.setCurrentStyles();
    }

    setCurrentStyles() {
        this.currentStyles = {
            'height': window.innerHeight,
        };
    }

    onNormClick(e) {
        this.router.navigate(["/norm"]);
    }

    onSwapClick(e) {
        this.router.navigate(["/swap"]);
    }

    onAverageClick(e) {
        this.router.navigate(["/average"]);
    }

    onCoolClick(e) {
        this.router.navigate(["/cool-dirty"]);
    }

    onRecoEmotionClick(e) {
        this.router.navigate(["/reco-emotion"]);
    }

    onMakeEmotionClick(e) {
        this.router.navigate(["/make-emotion"]);
    }

    onViewerClick(e) {
        this.router.navigate(["/viewer"]);
    }
}
