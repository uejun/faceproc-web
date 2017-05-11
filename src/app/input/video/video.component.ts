import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  video;
  canvas;
    mediastream;

    @Input() private width: number;
    height: number;

    videoWidth: number;
    videoHeight: number;
    streaming = false;
    @ViewChild('myvideo') myvideo: ElementRef;
    @ViewChild('mycanvas') mycanvas: ElementRef;

    currentStyles = {};

    constructor() {
    }

    ngOnInit() {
        this.video = this.myvideo.nativeElement;
        this.canvas = this.mycanvas.nativeElement;

        this.videoWidth = this.width;
        this.height = this.videoHeight = this.videoWidth * (3 / 4);
    }


    canPlay() {
        if (!this.streaming) {
            this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
            if (isNaN(this.height)) {
                this.height = this.width / (4 / 3);
            }
            this.streaming = true;
        }
    }

    setupCamera() {
        var n = <any>navigator;
        n.mediaDevices.getUserMedia({video: true, audio: false})
            .then(
                stream => {
                    this.mediastream = stream;
                    console.log(stream);
                    this.video.srcObject = stream;
                    //this.video.play();
                },
                err => {
                    console.log("An error occured! " + err);
                }
            );
    }

    playCamera() {
        this.mediastream = null;
        this.setupCamera();
        this.video.play()
    }

    stopCamera() {
        this.video.pause();
        this.mediastream.getVideoTracks()[0].stop();
    }

    start() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    takePhoto(): string {
        this.drawCanvas();
        return this.canvas.toDataURL('image/jpeg');
    }

    private drawCanvas() {
        var context = this.canvas.getContext('2d');
        if (this.width && this.height) {
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            context.drawImage(this.video, 0, 0, this.width, this.height);
        } else {
            //this.clearphoto();
        }
    }

}
