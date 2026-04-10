import {FileReader} from './fileReader'
import {TorrentFile, TorrentFileInformation} from './torrentFile';
import {Configuration} from './configuration';

export class Parser {
    constructor(private readonly configuration: Configuration, private readonly fileReader: FileReader){}

    public parse() : TorrentFile {
        const content = this.fileReader.read(this.configuration.getConfiguration());
        if(!content ||
            content.length <= 0 ||
            typeof content !== "string" ||
            !content.startsWith("d") ||
            !content.endsWith("e")) {
            return new TorrentFile({ announce: "" });
        }
         return new TorrentFile({
            announce: this.getAnnounceFrom(content),
            comment: this.getCommentFrom(content),
            createdBy: this.getCreatedByFrom(content),
            creationDate: this.getCreationDateFrom(content),
            encoding: this.getEncodingFrom(content),
            info: this.getInfoFrom(content)
        });
    }

    private getAnnounceFrom(content: string): string {
        const key = '8:announce';

        const position = content.indexOf(key);
        if(position === -1) {
            return "";
        }

        let start = position + key.length;
        let end = start;
        while (content[end] && /[0-9]/.test(content[end])) {
            end++;
        }
        if (start === end) {
            return "";
        }

        const positionOfColon = content.indexOf(':', end);
        if (positionOfColon === -1) {
            return "";
        }

        const valueLength = parseInt(content.substring(start, end), 10);
        if (isNaN(valueLength)) {
            return "";
        }

        const positionOfStartValue = positionOfColon + 1;
        return content.substring(positionOfStartValue, positionOfStartValue + valueLength);
    }

    private getCommentFrom(content: string): string {
        const key = '7:comment';

        const index = content.indexOf(key);
        if (index === -1) {
            return "";
        }

        let start = index + key.length;
        let end = index + key.length;
        while (content[end] && /[0-9]/.test(content[end])) {
            end++;
        }
        if (start === end) {
            return "";
        }

        const positionOfColon = content.indexOf(':', end);
        if (positionOfColon === -1) {
            return "";
        }

        const valueLength = parseInt(content.substring(start, end), 10);
        if (isNaN(valueLength)) {
            return "";
        }
        const positionOfStartValue = positionOfColon + 1;
        return content.substring(positionOfStartValue, positionOfStartValue + valueLength);
    }

    private getCreatedByFrom(content: string): string {
        const key = '10:created by';

        const position = content.indexOf(key);
        if (position === -1) {
             return "";
        }

        let start = position + key.length;
        let end = start;
        while (content[end] && /[0-9]/.test(content[end])) {
            end++;
        }
        if (start === end) {
            return "";
        }

        const positionOfColon = content.indexOf(':', end);
        if (positionOfColon === -1) {
            return "";
        }

        const valueLength = parseInt(content.substring(start, end), 10);
        if (isNaN(valueLength)) {
            return "";
        }
        const positionOfStartValue = positionOfColon + 1;
        return content.substring(positionOfStartValue, positionOfStartValue + valueLength);
    }

    private getCreationDateFrom(content: string): number {
        const key = '13:creation date';

        const position = content.indexOf(key);
        if (position === -1) {
            return 0;
        }

        const start = content.indexOf('i', position + key.length);
        if (start === -1) {
            return 0;
        }

        const end = content.indexOf('e', start);
        if (end === -1 || end <= start + 1) {
            return 0;
        }

        const number = content.substring(start + 1, end);
        const creationDate = parseInt(number, 10);
        if(isNaN(creationDate)) {
            return 0;
        }
        return creationDate;
    }

    private getEncodingFrom(content: string): string {
        const key = '8:encoding';
        const index = content.indexOf(key);
        if (index === -1) {
            return "";
        }

        let start = index + key.length;
        let end = index + key.length;
        while (content[end] && /[0-9]/.test(content[end])) {
            end++;
        }
        if (start === end) {
            return "";
        }
        if (content[end] !== ':') {
            return "";
        }

        const valueLength = parseInt(content.substring(start, end), 10);
        if (isNaN(valueLength)) {
            return "";
        }

        const positionOfStartValue = end + 1;
        if (positionOfStartValue + valueLength > content.length) {
            return "";
        }
        return content.substring(positionOfStartValue, positionOfStartValue + valueLength);
    }

    private getInfoFrom(content: string): TorrentFileInformation {
        const info = '4:info';
        const start = content.indexOf(info);
        if (start === -1) {
            return new TorrentFileInformation({ length: 0, name: "", pieceLength: 0, private: false, pieces: new Uint8Array([]) });
        }

        return new TorrentFileInformation({
            length: this.getInfoLengthFrom(content),
            name: this.getInfoNameFrom(content),
            pieceLength: this.getInfoPieceLengthFrom(content),
            private: this.getInfoPrivateFrom(content),
            pieces: this.getInfoPiecesFrom(content)
        });
    }

    private getInfoLengthFrom(content: string): number {
        const match = content.match(/6:lengthi(\d+)e/);
        if (!match) {
            return 0;
        }

        return parseInt(match[1], 10);
    }

    private getInfoNameFrom(content: string): string{
        const key = '4:name';

        const index = content.indexOf(key);
        if (index === -1) {
            return "";
        }
        let start = index + key.length;
        let end = start;
        while (content[end] && /[0-9]/.test(content[end])) {
            end++;
        }
        if(start === end) {
            return "";
        }
        const length = parseInt(content.slice(start, end), 10);
        if (isNaN(length) || content[end] !== ':') {
            return "";
        }
        return content.substr(end + 1, length);
    }

    private getInfoPieceLengthFrom(content: string): number {
        const match = content.match(/12:piece lengthi(-?\d+)e/);
        if (!match) {
            return 0;
        }
        return parseInt(match[1], 10);
    }

    private getInfoPrivateFrom(content: string): boolean {
        const match = content.match(/7:privatei([01])e/);
        if (!match) {
            return false;
        }
        return match[1] === '1';
    }

    private getInfoPiecesFrom(content: string): Uint8Array{
        throw new Error("Not implemented yet");
    }
}
