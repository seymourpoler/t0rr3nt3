export class TorrentFile{
    private name: string;
    private infoHash: string;
    private length : number;
    private announce : string;

    constructor(){
        this.name = "";
        this.infoHash = "";
        this.length = 0;
        this.announce = "";
    }

    public getName(): string{
        return this.name;
    }

    public getInfoHash(): string{
        return this.infoHash;
    }

    public getLength(): number{
        return this.length;
    }

    getAnnounce(): any {
        return this.announce;
    }
}