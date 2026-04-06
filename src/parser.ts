import { FileReader} from './fileReader'
import { TorrentFile } from './torrentFile';
import { Configuration } from './configuration';

export class Parser {
    constructor(private readonly configuration: Configuration, private readonly fileReader: FileReader){}

    public parse() : TorrentFile {
        const fileContent = this.fileReader.read(this.configuration.getConfiguration());
        if(!fileContent || fileContent.length <= 0 || typeof fileContent !== "string"){
            return new TorrentFile({ announce: "" });
        }
        let announce = "";
        const position = fileContent.indexOf('announce');
        if(position === -1){
            return new TorrentFile({ announce: "" });
        }
        const s = fileContent.substring(position);
        const firstColon = s.indexOf(':');
        const secondColon = s.indexOf(':', firstColon + 1);
        if (secondColon !== -1) {
            // Announce URL starts after the second colon
            // It's everything until the last 'e' (remove trailing e)
            let announceValue = s.substring(secondColon + 1);
            // Remove trailing 'e' if present
            if (announceValue.endsWith('e')) {
                announceValue = announceValue.slice(0, -1);
            }
            announce = announceValue;
        }
        return new TorrentFile({ announce: announce });
    }
}