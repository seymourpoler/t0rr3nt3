export class TorrentFile {
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
        info?: {
            length?: number,
            name?: string,
            pieceLength?: number
        }
    }) {
        this.announce = args?.announce ?? "";
        this.comment = args?.comment ?? "";
        this.createdBy = args?.createdBy ?? "";
        this.creationDate = args?.creationDate ?? 0;
        this.encoding = args?.encoding ?? "";
        this.info = new TorrentFileInformation({
          length: args?.info?.length ?? 0,
          name: args?.info?.name ?? "",
          pieceLength: args?.info?.pieceLength ?? 0
        });
    }
}

export class TorrentFileInformation {
    public readonly length: number;
    public readonly name: string;
    public readonly pieceLength : number;

    constructor(args:{length:number, name: string, pieceLength:number}) {
        this.length = args?.length ?? 0;
        this.name = args?.name ?? "";
        this.pieceLength = args?.pieceLength ?? 0;
    }
}
