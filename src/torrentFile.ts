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
        info?: { length?: number, name?: string, pieceLength?: number, private?: boolean, pieces?: Uint8Array }
    }) {
        this.announce = args?.announce ?? "";
        this.comment = args?.comment ?? "";
        this.createdBy = args?.createdBy ?? "";
        this.creationDate = args?.creationDate ?? 0;
        this.encoding = args?.encoding ?? "";
        this.info = new TorrentFileInformation({
          length: args?.info?.length ?? 0,
          name: args?.info?.name ?? "",
          pieceLength: args?.info?.pieceLength ?? 0,
          private: args?.info?.private ?? false,
          pieces: args?.info?.pieces ?? new Uint8Array([])
        });
    }
}

export class TorrentFileInformation {
    public readonly length: number;
    public readonly name: string;
    public readonly pieceLength : number;
    public readonly private: boolean;
    public readonly pieces: Uint8Array;

    constructor(args:{length:number, name: string, pieceLength:number, private: boolean, pieces: Uint8Array}) {
        this.length = args?.length ?? 0;
        this.name = args?.name ?? "";
        this.pieceLength = args?.pieceLength ?? 0;
        this.private = args?.private ?? false;
        this.pieces = args?.pieces ?? new Uint8Array([]);
    }
}
