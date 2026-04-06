import { describe, beforeEach, it, expect } from "vitest";
import { FileReader } from "../src/fileReader";
import { Parser } from '../src/parser'
import { mock } from 'vitest-mock-extended';
import { TorrentFile } from "../src/torrentFile";
import { Configuration } from "../src/configuration";

describe('parser', function(){
    let fileReader : FileReader;
    let parser : Parser;
    let configuration: Configuration;

    beforeEach(function(){
        configuration = mock<Configuration>();
        fileReader = mock<FileReader>();
        parser = new Parser(configuration, fileReader);
    });

    it('returns an empty torrent, when file is empty', function(){
        (fileReader.read as any).mockReturnValue("");

        const torrentFile = parser.parse();

        expect(torrentFile).toBeInstanceOf(TorrentFile);
        expect(torrentFile.getInfoHash()).toBe("");
        expect(torrentFile.getName()).toBe("");
        expect(torrentFile.getLength()).toBe(0);
        expect(torrentFile.getPieceLength()).toBe(0);
        expect(torrentFile.getAnnounce()).toBe("");
    });

    it('return empty torrent file, when does not start right', () => {
        (fileReader.read as any).mockReturnValue("8:announce13:33:http://192.168.1.74:6969/announcee");

        const torrentFile = parser.parse();

        expect(torrentFile).toBeInstanceOf(TorrentFile);
        expect(torrentFile.getInfoHash()).toBe("");
        expect(torrentFile.getName()).toBe("");
        expect(torrentFile.getLength()).toBe(0);
        expect(torrentFile.getPieceLength()).toBe(0);
        expect(torrentFile.getAnnounce()).toBe("");
    });

    it('returns announce', function(){
        (fileReader.read as any).mockReturnValue("d8:announce13:33:http://192.168.1.74:6969/announcee");

        const torrentFile = parser.parse();

        expect(torrentFile.getAnnounce()).toBe("http://192.168.1.74:6969/announce");
    })
});