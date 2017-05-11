import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

    video = null;
    canvas = null;
    mediastream = null;

    @Input() width: number;
    height: number;

    public videoWidth: number;
    public videoHeight: number;
    public streaming = false;
    @ViewChild('myvideo') myvideo: ElementRef;
    @ViewChild('mycanvas') mycanvas: ElementRef;


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

    public setupCamera() {
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

    public playCamera() {
        this.mediastream = null;
        this.setupCamera();
        this.video.play()
    }

    public stopCamera() {
        this.video.pause();
        this.mediastream.getVideoTracks()[0].stop();
    }

    public start() {
        this.video.play();
    }

    public pause() {
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
