export class TorrentFile{
    
    private name: string;
    private infoHash: string;
    private length : number;
    private pieceLenght : number;
    private announce : string;

    constructor(){
        this.name = "";
        this.infoHash = "";
        this.length = 0;
        this.pieceLenght = 0;
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

    public getPieceLength(): number {
        return this.pieceLenght;
    }

    public getAnnounce(): any {
        return this.announce;
    }
}