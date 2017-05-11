import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';
import {ImageService} from "../../service/image.service";
import {Image} from "../../entities/image";

@Component({
  selector: 'app-folder-select',
  templateUrl: './folder-select.component.html',
  styleUrls: ['./folder-select.component.css']
})
export class FolderSelectComponent implements OnInit {

  public loadedFiles: Array<File> = [];
    public loadedImages: Array<Image> = [];

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

    // 拡張子が小文字にした時 png, jpg, jpeg, bmpのものだけ返す
    extractImageFile(files: Array<File>): Array<File> {
        var results: Array<File> = [];
        for(let f of files) {
            let parts = f.name.split(".");
            let ext = parts[parts.length -1].toLowerCase();
            if (ext == "png" || ext == "jpg" || ext == "jpeg" || ext == "bmp") {
                results.push(f);
            }
        }
        return results;
    }

    handleFolderSelect(e: any): void {
        this.loadedFiles= this.extractImageFile(e.target.files);

        // console.log(this.loadedFiles);
        // for (let file of this.loadedFiles) {
        //     console.log(file);
        // }
        // this.loadedImages = this.imageService.convertFiles2StrImages(this.loadedFiles);
        // console.log(this.loadedImages);
    }

}
