export class TorrentFile {
    
    private name: string;
    private infoHash: string;
    private length : number;
    private pieceLenght : number;
    public readonly announce : string;
    public readonly comment : string;
    public readonly createdBy : string;
    public readonly creationDate : number;
    public readonly encoding: string;
    public readonly info: TorrentFileInformation;

    constructor(args?: {
        announce?: string;
        name?: string;
        infoHash?: string;
        length?: number;
        pieceLength?: number;
        comment?: string,
        createdBy?: string,
        creationDate?: number,
        encoding?: string,
        info?: TorrentFileInformation}) {

        this.name = args?.name ?? "";
        this.infoHash = args?.infoHash ?? "";
        this.length = args?.length ?? 0;
        this.pieceLenght = args?.pieceLength ?? 0;
        this.announce = args?.announce ?? "";
        this.comment = args?.comment ?? "";
        this.createdBy = args?.createdBy ?? "";
        this.creationDate = args?.creationDate ?? 0;
        this.encoding = args?.encoding ?? "";
        this.info = args?.info ?? new TorrentFileInformation({length:0, name: ""});
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
}

export class TorrentFileInformation {
    public readonly length: number;
    public readonly name: string;

    constructor(args:{length:number, name: string}){
        this.length = args?.length ?? 0;
        this.name = args?.name ?? "";
    }
}
