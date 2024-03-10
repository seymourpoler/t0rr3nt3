"use strict"

import { FileReader} from './fileReader'
import { TorrentFile } from './torrentFile';
import { Configuration } from './configuration';

export class Parser{
    private readonly fileReader: FileReader;
    private readonly configuration: Configuration;

    constructor(configuration: Configuration, fileReader: FileReader){
        this.fileReader = fileReader;
        this.configuration = configuration;
    }

    public parse() : TorrentFile {
        const file = this.fileReader.read(this.configuration.getConfiguration();
        return new TorrentFile();
    }
}