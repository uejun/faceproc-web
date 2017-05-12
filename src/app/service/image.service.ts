import {Injectable} from '@angular/core';
import {Http, RequestOptions, Headers, Response} from "@angular/http";
import {Image} from "../entities/image";
import {Observable} from "rxjs";
import {Ping} from "../entities/ping";

@Injectable()
export class ImageService {

    endpoint = "https://www.avatar-eye.com";
    // endpoint = "http://localhost:5050";
    pingUrl = this.endpoint + "/ping";
    normUrl = this.endpoint + "/norm";
    swapUrl = this.endpoint + "/swap";
    swapInOneUrl = this.endpoint + "/swap_in_one";
    averageUrl = this.endpoint + "/average";
    coolUrl = this.endpoint + "/cool";
    dirtyUrl = this.endpoint + "/dirty";
    recoemotionUrl = this.endpoint + "/reco_emotion";
    makeEmotionUrl = this.endpoint + "/make_emotion";

    constructor(private http: Http) {
    }

    convertFiles2Images(files: Array<File>): Array<Image> {
        var images: Array<Image> = [];
        for (let f of files) {
            var image = new Image();
            var reader: FileReader = new FileReader();
            reader.onloadend = (function (image) {
                return (e) => {
                    image.data = e.target.result;
                }
            })(image);
            reader.readAsDataURL(f);

            var byteReader: FileReader = new FileReader();
            byteReader.onloadend = (function (image) {
                return (e) => {
                    image.bdata = e.target.result;
                }
            })(image);
            byteReader.readAsArrayBuffer(f);

            image.setName(f.name);
            images.push(image)
        }
        return images;
    }

    getPing(): Promise<Ping> {
        return this.http.get(this.pingUrl)
            .toPromise()
            .then(response => {
                return response.json() as Ping;
            })
            .catch(this.handleError);
    }

    norm(images): Promise<any> {
        return this.postImages(images, this.normUrl)
            .toPromise()
            .then(res => {
                return this.convertReponse2Images(res);
            })
            .catch(this.handleError);
    }

    swap(images): Promise<any> {
        return this.postImages(images, this.swapUrl)
            .toPromise()
            .then(res => this.convertReponse2Images(res))
            .catch(this.handleError);
    }

    swapInOne(images): Promise<any> {
        return this.postImages(images, this.swapInOneUrl)
            .toPromise()
            .then(res => this.convertReponse2Images(res))
            .catch(this.handleError);
    }

    average(images): Promise<any> {
        return this.postImages(images, this.averageUrl)
            .toPromise()
            .then(res => this.convertReponse2Images(res))
            .catch(this.handleError);
    }

    cool(images): Promise<any> {
        return this.postImages(images, this.coolUrl)
            .toPromise()
            .then(res => {
                return this.convertReponse2Images(res);
            })
            .catch(this.handleError);
    }

    dirty(images): Promise<any> {
        return this.postImages(images, this.dirtyUrl)
            .toPromise()
            .then(res => this.convertReponse2Images(res))
            .catch(this.handleError);
    }

    recoEmotion(images): Promise<any> {
        return this.postImages(images, this.recoemotionUrl)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    // recoEmotion(images: Array<Image>): Promise<any> {
    //     let headers = new Headers({});
    //     let options = new RequestOptions({headers});
    //     let reqData: any;
    //
    //     var formData = new FormData();
    //     for (var i = 0; i < images.length; i++) {
    //         console.log(images[i]);
    //         // Remove "data: image/jpeg; base64, "
    //         let data = images[i].getData().replace(/^.*,/, '');
    //         formData.append('image' + (i + 1), data);
    //     }
    //     reqData = formData;
    //
    //     // return this.postImages(images, this.recoemotionUrl)
    //     return this.http.post(this.recoemotionUrl, reqData, options)
    //         .toPromise()
    //         .then(res => res.json())
    //         .catch(this.handleError);
    // }

    makeEmotion(images, emotion): Promise<any> {
        var url = this.makeEmotionUrl + "/" + emotion;
        return this.postImages(images, url)
            .toPromise()
            .then(res => this.convertReponse2Images(res))
            .catch(this.handleError)
    }

    private postImages(images: Array<Image>, url: string): Observable<Response> {
        let headers = new Headers({});
        let options = new RequestOptions({headers});
        let reqData: any;

        if (images.length == 1 && images[0].bdata != null) {
            headers.append('Content-Type', images[0].getContentType());
            reqData = images[0].bdata;
        } else {
            console.log("hey1");
            var formData = new FormData();
            for (var i = 0; i < images.length; i++) {
                // Remove "data: image/jpeg; base64, "
                let data = images[i].data.replace(/^.*,/, '');
                formData.append('image' + (i + 1), data);
            }
            reqData = formData;
            console.log("hey");
        }
        return this.http.post(url, reqData, options)
    }

    private convertReponse2Images(response: Response) {
        var images: Image[] = [];
        if (response.status == 200) {
            let results = response.json()["results"];
            for (let base64image of results) {
                let data = this.createURLSrc(base64image);
                images.push(new Image(data));
            }
        }
        return images;
    }

    private createURLSrc(base64image: string): string {
        return "data:image/jpeg;base64," + base64image;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
