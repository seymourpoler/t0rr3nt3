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
        expect(torrentFile.announce).toBe("");
    });

    it('return empty torrent file, when does not start right', () => {
        (fileReader.read as any).mockReturnValue("8:announce13:33:http://192.168.1.74:6969/announcee");

        const torrentFile = parser.parse();

        expect(torrentFile).toBeInstanceOf(TorrentFile);
        expect(torrentFile.getInfoHash()).toBe("");
        expect(torrentFile.getName()).toBe("");
        expect(torrentFile.getLength()).toBe(0);
        expect(torrentFile.getPieceLength()).toBe(0);
        expect(torrentFile.announce).toBe("");
    });

    it('return empty torrent file, when does not end right', () => {
        (fileReader.read as any).mockReturnValue("d8:announce13:33:http://192.168.1.74:6969/announceh");

        const torrentFile = parser.parse();

        expect(torrentFile).toBeInstanceOf(TorrentFile);
        expect(torrentFile.getInfoHash()).toBe("");
        expect(torrentFile.getName()).toBe("");
        expect(torrentFile.getLength()).toBe(0);
        expect(torrentFile.getPieceLength()).toBe(0);
        expect(torrentFile.announce).toBe("");
    });

    describe('when parse announce', () =>{
        it('returns announce', function(){
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announcee");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
        })
    })

    describe('when parse comment', () =>{
        it('returns comment', function(){
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes heree");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
            expect(torrentFile.comment).toBe("Comment goes here");
        })
    })

    describe('when parse created by', () => {
        it('returns created by', () => {
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)e");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
            expect(torrentFile.comment).toBe("Comment goes here");
            expect(torrentFile.createdBy).toBe("Transmission/2.92 (14714)");
        })
    })
});