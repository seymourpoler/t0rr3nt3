export class TorrentFile{
    private  name: string;
    private infoHash: string;
    
    public getName(): string{
        return this.name;
    }

    public getInfoHash(): string{
        return this.infoHash;
    }

    constructor(){
        this.name = "";
        this.infoHash = "";
    }
}