import { FileReader} from './fileReader'
import { TorrentFile } from './torrentFile';
import { Configuration } from './configuration';

export class Parser {
    constructor(private readonly configuration: Configuration, private readonly fileReader: FileReader){}

    public parse() : TorrentFile {
        const fileContent = this.fileReader.read(this.configuration.getConfiguration());
        if(!fileContent ||
            fileContent.length <= 0 ||
            typeof fileContent !== "string" ||
            !fileContent.startsWith("d") ||
            !fileContent.endsWith("e")) {
            return new TorrentFile({ announce: "" });
        }
        const position = fileContent.indexOf('announce');
        if(position === -1){
            return new TorrentFile({ announce: "" });
        }
        const announce = fileContent.substring(position);
        const firstColon = announce.indexOf(':');
        const secondColon = announce.indexOf(':', firstColon + 1);
        if (secondColon === -1) {
            return new TorrentFile({ announce: "" });
        }
        let announceValue = announce.substring(secondColon + 1);
        if (announceValue.endsWith('e')) {
            announceValue = announceValue.slice(0, -1);
            return new TorrentFile({ announce: announceValue });
        }
        return new TorrentFile({ announce: "" });
    }
}