import { describe, beforeEach, it, expect } from "vitest";
import { FileReader } from "../src/fileReader";
import { Parser } from '../src/parser'
import { TorrentFile } from "../src/torrentFile";
import { Configuration } from "../src/configuration";
import { spyAllMethodsOf } from "./testing";

describe('parser', function(){
    let fileReader : FileReader;
    let parser : Parser;
    let configuration: Configuration;

    beforeEach(function(){
        configuration = new Configuration();
        spyAllMethodsOf(configuration);
        fileReader = new FileReader();
        spyAllMethodsOf(fileReader);
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
        it('returns empty for missing announce', function(){
            (fileReader.read as any).mockReturnValue("dd4:name5:file1ee");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("");
        });

        it('returns empty for missing announce', function(){
            (fileReader.read as any).mockReturnValue("dd4:name5:file1ee");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("");
        });

        it('returns empty when there is no the first colon', function(){
            (fileReader.read as any).mockReturnValue("d8announce33:http://192.168.1.74:6969/announcee");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("");
        });

        it('returns empty when there is no the last colon', function(){
            (fileReader.read as any).mockReturnValue("d8announce33http://192.168.1.74:6969/announcee");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("");
        });

        it('returns announce', function(){
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announcee");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
        });

        it.each`
            content       
            ${"d:announce33:http://192.168.1.74:6969/announce3e"}   
            ${"d8announce33:http://192.168.1.74:6969/announce3e"}
            ${"d8:aerounce33:http://192.168.1.74:6969/announce3e"}   
            ${"d8:33:http://192.168.1.74:6969/announce3e"}
            ${"d8:announce:http://192.168.1.74:6969/announce3e"}   
            ${"d8:announce33http://192.168.1.74:6969/announce3e"}   
            ${"d8:announce33:e"}   
          `("returns empty when comment '$password' is wrong", (content: string) => {
            (fileReader.read as any).mockReturnValue(content);

            const torrentFile = parser.parse();

            expect(torrentFile.comment).toBe("");
        });
    });

    describe('when parse comment', () =>{
        it('returns comment', function(){
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes heree");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
            expect(torrentFile.comment).toBe("Comment goes here");
        });

        it.each`
            content       
            ${"d8:announce33:http://192.168.1.74:6969/announce3:comment17:Comment goes heree"}   
            ${"d8:announce33:http://192.168.1.74:6969/announce:comment17:Comment goes heree"}  
            ${"d8:announce33:http://192.168.1.74:6969/announce7:commen17:Comment goes heree"}  
            ${"d8:announce33:http://192.168.1.74:6969/announce7:17:Comment goes heree"} 
            ${"d8:announce33:http://192.168.1.74:6969/announce7comment17:Comment goes heree"} 
            ${"d8:announce33:http://192.168.1.74:6969/announce7:comment17Comment goes heree"}
          `("returns empty when comment '$password' is wrong", (content: string) => {
                (fileReader.read as any).mockReturnValue(content);

                const torrentFile = parser.parse();

                expect(torrentFile.comment).toBe("");
        });
    });

    describe('when parse created by', () => {
        it('returns created by', () => {
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)e");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
            expect(torrentFile.comment).toBe("Comment goes here");
            expect(torrentFile.createdBy).toBe("Transmission/2.92 (14714)");
        })

        it.each`
            content        
            ${"d7:comment17:Comment:created by25:Transmission/2.92 (14714)e"} 
            ${"d7:comment17:Comment10created by25:Transmission/2.92 (14714)e"}
            ${"d7:comment17:Comment10:cre by25:Transmission/2.92 (14714)e"}
            ${"d7:comment17:Comment10:25:Transmission/2.92 (14714)e"}
            ${"d7:comment17:Comment10:created by:Transmission/2.92 (14714)e"}   
            ${"d7:comment17:Comment10:created by25Transmission/2.92 (14714)e"}    
            ${"d7:comment17:Comment10:created by25:e"}
          `("returns empty when comment '$password' is wrong", (content: string) => {
            (fileReader.read as any).mockReturnValue(content);

            const torrentFile = parser.parse();

            expect(torrentFile.comment).toBe("");
        });
    })
});