export class TorrentFile {
    
    private name: string;
    private infoHash: string;
    private length : number;
    private pieceLenght : number;
    private announce : string;
    public readonly comment : string;

    constructor(args?: { announce?: string; name?: string; infoHash?: string; length?: number; pieceLength?: number; comment?: string }){
        this.name = args?.name ?? "";
        this.infoHash = args?.infoHash ?? "";
        this.length = args?.length ?? 0;
        this.pieceLenght = args?.pieceLength ?? 0;
        this.announce = args?.announce ?? "";
        this.comment = args?.comment ?? "";
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