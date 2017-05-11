export class Image {

    public data :string;
    public bdata: any;
    public name: string;
    public ext: string;

    constructor(_data?: string, _bdata?:any) {
        if (_data) {
            this.data = _data;
        }
        if (_bdata) {
            this.bdata = _bdata;
        }
    }

    public setData(_data: string) {
        this.data = _data;
    }

    public setName(_name: string) {
        this.name = _name;
        let parts = this.name.split(".");
        this.ext = parts[parts.length -1].toLowerCase();

    }

    public getContentType(): string {
        switch(this.ext) {
            case "jpg": {
                return "image/jpeg";
            }
            case "jpeg": {
                return "image/jpeg";
            }
            case "png": {
                return "image/png";
            }
            case "bmp": {
                return "image/bmp";
            }
            default: {
                return "unknown";
            }
        }
    }

    public getData(): string {
        return this.data;
    }
}
