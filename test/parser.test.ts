import { FileReader } from "../src/fileReader";
import { Parser } from '../src/parser'
import { mock } from 'vitest-mock-extended';
import { describe, beforeEach, it, expect } from "vitest";
import { TorrentFile } from "../src/torrentFile";
import { Configuration } from "../src/configuration";

describe('parser', function(){
    let fileReader : FileReader;
    let parser : Parser;
    let configuration: Configuration;

    beforeEach(function(){
        configuration = mock<Configuration>();
        fileReader = mock<FileReader>();
    });

    it('returns an empty torrent, when file is null', function(){
        configuration.getConfiguration.mockReturnValue("configuration")
        fileReader.read.mockReturnValue("");
        parser = new Parser(configuration, fileReader);

        const torrentFile = parser.parse();

        expect(torrentFile).toBeInstanceOf(TorrentFile);
        expect(torrentFile.getInfoHash()).toBe("");
        expect(torrentFile.getName()).toBe("");
        expect(torrentFile.getLength()).toBe(0);
    });
});