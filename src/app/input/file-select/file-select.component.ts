import {Component, OnInit, ViewChild, ElementRef, Input} from '@angular/core';
import {Image} from "../../entities/image";
import {ImageService} from "../../service/image.service";

@Component({
  selector: 'app-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.css']
})
export class FileSelectComponent implements OnInit {


    loadedFiles: Array<any>;
    public loadedImages: Array<Image> = [];
    // @Output() onLoaded = new EventEmitter<boolean>();

    @ViewChild('inputContainer') inputContainer: ElementRef;
    @Input() gridListCols: number;
    countImagePerRow:number;

    imageWidth: number;
    girdRowHeight = "200px";
    currentStyles = {};
    loadedTiles = [];

    toolTile = {cols: 1, rows: 1, color: 'lightblue'};

    constructor(private imageService: ImageService) {
    }

    ngOnInit() {
        this.setCurrentStyles();
        this.countImagePerRow = this.gridListCols;
    }

    setCurrentStyles() {
        this.currentStyles = {
            // CSS styles: set per current state of component properties
            "float": "left",
            "width": "50%"
        };
    }

    handleFileSelect(e: any): void {
        this.loadedFiles = e.target.files;
        this.loadedImages = this.imageService.convertFiles2Images(this.loadedFiles);

        // this.imageWidth= window.innerWidth / this.imageCountPerRow;
        let compWidth = window.innerWidth / 2; // because this comp has max-width: 50%
        this.imageWidth= compWidth / this.countImagePerRow;

        this.girdRowHeight = String(this.imageWidth * 3 / 4) + "px";

        for(let image of this.loadedImages) {
            this.loadedTiles.push({cols: 1, rows: 1, color: 'lightgreen', image: image})
        }

        // this.onLoaded.emit(true);
    }


}
