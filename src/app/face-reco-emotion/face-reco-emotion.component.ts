import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FileSelectComponent} from "../input/file-select/file-select.component";
import {Donut3d} from "../graph/donut3d";
import {ImageService} from "../service/image.service";
import {Image} from "../entities/image";
import {Observable} from "rxjs";
import {VideoComponent} from "../input/video/video.component";
import {FolderSelectComponent} from "../input/folder-select/folder-select.component";

import * as d3 from "d3";

@Component({
    selector: 'app-face-reco-emotion',
    templateUrl: './face-reco-emotion.component.html',
    styleUrls: ['./face-reco-emotion.component.css']
})
export class FaceRecoEmotionComponent implements OnInit {

    // FileSelect Settings
    @ViewChild(FileSelectComponent) fileSelectComp: FileSelectComponent;

    // FolderSelect Settings
    @ViewChild(FolderSelectComponent) folderSelectComp: FolderSelectComponent;

    // Video Settings
    @ViewChild('cameraDiv') private cameraDiv: ElementRef;
    @ViewChild(VideoComponent) private videoComp: VideoComponent;
    isCameraOn = false;
    StartOrPauseTxt = "Start";
    videoWidth: number;
    cameraStyles = {};

    // PieGraph Settings
    @ViewChild('piegraph') private pieContainer: ElementRef;
    @ViewChild('pieGraphForCamera') private pieGraphForCamera: ElementRef;
    donut: Donut3d;
    donutForCamera: Donut3d;
    pieCurrentStyles = {};
    pieCurrentStylesForCamera = {};

    // Cameraモード: 一秒ごとにPOSTするSubscription
    requestTickerSubscription;
    isSubscribed = false;

    // Folderモード
    fileLoaded: boolean = false;
    progress: number = 0;
    doneProgress: boolean = false;
    // フォルダモードにおける結果の中身
    csvContentStr: string = "";
    // フォルダモードにおける現在の処理完了カウント
    doneProgressCount = 0;


    initialData = [
        {label: "happy", color: "#3366CC"},
        {label: "sad", color: "#DC3912"},
        {label: "angry", color: "#FF9900"},
        {label: "surprise", color: "#109618"},
        {label: "neutral", color: "#990099"}
    ];

    constructor(private imageService: ImageService) { }

    ngOnInit() {

        this.videoWidth = 320;
        this.setCurrentStyles();

        this.createDonut();
        this.createDonutForCamera();
    }

    createDonut() {
        var element = this.pieContainer.nativeElement;
        var svgWidth = window.innerWidth / 2;
        var svgHeight = window.innerHeight;
        var svg = d3.select(element).append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        var id = "salesDonut";
        var piedata: any = this.randomData();
        var rx = svgWidth / 3;
        var ry = 150;
        var cx = svgWidth / 2 - 25;
        var cy = ry * (1.5);
        var h = 50;
        var ir = 0.4;

        this.donut = new Donut3d(svg, id, cx, cy, rx, ry, h, ir);
        this.donut.createPie(piedata);
    }

    createDonutForCamera() {
        var element = this.pieGraphForCamera.nativeElement;
        var svgWidth = window.innerWidth / 2;
        var svgHeight = window.innerHeight;
        var svg = d3.select(element).append('svg')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        var id = "donutForCamera";
        var piedata: any = this.randomData();
        var rx = svgWidth / 3;
        var ry = 150;
        var cx = svgWidth / 2 - 10;
        var cy = ry * (1.5);
        var h = 50;
        var ir = 0.4;

        this.donutForCamera = new Donut3d(svg, id, cx, cy, rx, ry, h, ir);
        this.donutForCamera.createPie(piedata);
    }

    setCurrentStyles() {
        this.cameraStyles = {
            "float": "left",
            "width": this.videoWidth
        };
        this.pieCurrentStyles = {
            // CSS styles: set per current state of component properties
            "float": "left",
            "width": "50%"
        };
        this.pieCurrentStylesForCamera = {
            "float": "left",
            "width": "50%"
        };
    }

    onUploadClick(): void {
        this.imageService.recoEmotion(this.fileSelectComp.loadedImages)
            .then((json) => {
                console.log(json);
                const data = this.convertEmotionData(json);
                this.donut.transition(data);
            });
    }

    // フォルダモードにおいて, 一枚の画像を読み込み、感情認識をリクエストする関数
    doOneRecoEmotionProcess(f) {
        var reader: FileReader = new FileReader();
        reader.onloadend = (e) => {
            var image = new Image(reader.result);
            image.setName(f.name);
            this.imageService.recoEmotion([image])
                .then((json) => {
                    console.log(json);
                    const r = json["results"][0];
                    this.csvContentStr += image.name + "," +
                        r["anger"] + "," +
                        r["happiness"] + "," +
                        r["neutral"] + "," +
                        r["sadness"] + "," +
                        r["surprise"] + "\n";
                    console.log(r);
                })
                .then(() => {
                    this.doneProgressCount += 1;
                    this.progress = this.doneProgressCount / this.folderSelectComp.loadedFiles.length * 100;
                    if (this.progress == 100) {
                        this.doneProgress = true;
                    }
                })
                .catch((ex) => {
                    this.csvContentStr += image.name + "," +
                        "err" + "," +
                        "err" + "," +
                        "err" + "," +
                        "err" + "," +
                        "err" + "\n";
                    this.doneProgressCount += 1;
                    this.progress = this.doneProgressCount / this.folderSelectComp.loadedFiles.length * 100;
                    if (this.progress == 100) {
                        this.doneProgress = true;
                    }
                });
        };
        reader.readAsDataURL(f);
    }

    // フォルダモードにおいて、複数画像をシリアルに行うために、sleepさせるための関数
    sleep(msec, val): Promise<number> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(val)
            }, msec);
        });
    }

    // フォルダモードにおいて、複数画像をシリアルに処理する
    async doMultiRecoEmotionSerialProcess() {
        for (let f of this.folderSelectComp.loadedFiles) {
            this.doOneRecoEmotionProcess(f);
            await this.sleep(1000, 10)
        }
    }

    // フォルダモードにおける処理開始ボタン押下時
    onStartProcessClick(): void {
        var totalNum = this.folderSelectComp.loadedFiles.length;
        this.csvContentStr += "name,anger,happiness,neutral,sadness,surprise\n";
        this.doMultiRecoEmotionSerialProcess();
    }

    // フォルダモードにおける結果ダウンロードボタン押下時
    onDownloadClick(): void {
        var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        var blob = new Blob([bom, this.csvContentStr], {"type": "text/csv"});
        window.open(window.URL.createObjectURL(blob));
    }

    // フォルダモードにおけるクリアボタン押下時
    onClearClick(): void {
        this.csvContentStr = "";
        this.doneProgressCount = 0;
        this.progress = 0;
        this.doneProgress = false;
    }

    // タブの切替時
    onSelectChange(e: any): void {
        if (e.index == 0) {
            // this.isCameraOn = false;
            // this.StartOrPauseTxt = "ReStart";
            // this.videoComp.stopCamera();
            // this.stopRequestTicker();
            if (this.isCameraOn) {
                this.videoComp.stopCamera();
                this.StartOrPauseTxt = "ReStart";
            }
            this.isCameraOn = false;
            if (this.isSubscribed) {
                this.stopRequestTicker();
            }
        } else if (e.index == 1) {
            this.isCameraOn = true;
            this.StartOrPauseTxt = "Pause";
            this.videoComp.playCamera();
            this.startRequestTicker();
        } else if (e.index == 2) {
            if (this.isCameraOn) {
                this.videoComp.stopCamera();
                this.StartOrPauseTxt = "ReStart";
            }
            this.isCameraOn = false;
            if (this.isSubscribed) {
                this.stopRequestTicker();
            }
        }
    }

    onCameraStartPauseClick(): void {
        this.isCameraOn = !this.isCameraOn;
        if (this.isCameraOn) {
            this.videoComp.start();
            this.startRequestTicker();
            this.StartOrPauseTxt = "Pause";
        } else {
            this.videoComp.pause();
            this.stopRequestTicker();
            this.StartOrPauseTxt = "ReStart";
        }
    }

    private randomData() {
        return this.initialData.map(function (d) {
            return {label: d.label, value: 1000 * Math.random(), color: d.color};
        });
    }

    // TickerによりRecoEmotionのリクエストをStartする
    private startRequestTicker() {
        this.requestTickerSubscription = Observable.interval(1000)
            .subscribe(v => {
                var images: Image[] = [
                    new Image(this.videoComp.takePhoto())
                ];
                this.sendRecoEmotionRequest(images);
            });
        this.isSubscribed = true;
    }

    // TickerによるRecoEmotionのリクエストをStopする
    private stopRequestTicker() {
        this.requestTickerSubscription.unsubscribe();
        this.isSubscribed = false;
    }

    private sendRecoEmotionRequest(data: Image[]) {
        this.imageService.recoEmotion(data)
            .then((json) => {
                const data = this.convertEmotionData(json);
                this.donutForCamera.transition(data);
            });
    }

    private convertEmotionData(jsonData): any {
        const results = jsonData["results"]
        var data = [
            {label: "happy", value: Number(results[0]["happiness"]), color: "#3366CC"},
            {label: "sad", value: Number(results[0]["sadness"]), color: "#DC3912"},
            {label: "angry", value: Number(results[0]["anger"]), color: "#FF9900"},
            {label: "surprise", value: Number(results[0]["surprise"]), color: "#109618"},
            {label: "neutral", value: Number(results[0]["neutral"]), color: "#990099"}
        ];
        return data;
    }




}
