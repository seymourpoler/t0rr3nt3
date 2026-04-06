import { FileReader} from './fileReader'
import { TorrentFile } from './torrentFile';
import { Configuration } from './configuration';

export class Parser {
    constructor(private readonly configuration: Configuration, private readonly fileReader: FileReader){}

    public parse() : TorrentFile {
        //const file = this.fileReader.read(this.configuration.getConfiguration());
        return new TorrentFile();
    }
}