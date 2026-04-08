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

    describe('when parse creation date', () => {
        it('returns creation date', () => {
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)13:creation datei1460444420ee");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
            expect(torrentFile.comment).toBe("Comment goes here");
            expect(torrentFile.createdBy).toBe("Transmission/2.92 (14714)");
            expect(torrentFile.creationDate).toBe(1460444420);
        })

        it.each`
            content        
            ${"d25:Transmission/2.92 (14714):creation datei1460444420ee"} 
            ${"d25:Transmission/2.92 (14714)13creation datei1460444420ee"}
            ${"d25:Transmission/2.92 (14714)13:crea datei1460444420ee"}
            ${"d25:Transmission/2.92 (14714)13:i1460444420ee"}
            ${"d25:Transmission/2.92 (14714)13:creation date1460444420ee"}   
            ${"d25:Transmission/2.92 (14714)13:creation datei1460444420ge"}    
            ${"d25:Transmission/2.92 (14714)13:creation datei1460444420e"}
          `("returns empty when comment '$password' is wrong", (content: string) => {
            (fileReader.read as any).mockReturnValue(content);

            const torrentFile = parser.parse();

            expect(torrentFile.createdBy).toBe("");
        });
    })

    describe('when parse encoding', () =>{
        it('returns encoding', () => {
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)13:creation datei1460444420e8:encoding5:UTF-8e");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
            expect(torrentFile.comment).toBe("Comment goes here");
            expect(torrentFile.createdBy).toBe("Transmission/2.92 (14714)");
            expect(torrentFile.creationDate).toBe(1460444420);
            expect(torrentFile.encoding).toBe("UTF-8");
        });

        it.each`
            content
            ${"d8:announce33:http://a/announce8encoding5:UTF-8e"}
            ${"d8:announce33:http://a/announce8:encoding5UTF-8e"}
            ${"d8:announce33:http://a/announce8:encoding:UTF-8e"}
            ${"d8:announce33:http://a/announce8:encodinge"}
            ${"d8:announce33:http://a/announceencoding5:UTF-8e"}
            ${"d8:encodinge"}
            ${"d8:encoding0:e"}
            ${"d8:encoding5:e"}
            `("returns empty when encoding field is malformed or missing", ( content: string) => {
                (fileReader.read as any).mockReturnValue(content);

                const torrentFile = parser.parse();

                expect(torrentFile.encoding).toBe("");
        });
    });

    describe('when parse info', () => {
        describe('when parse info.length', () => {
            it('returns info.length', () => {
                (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)13:creation datei1460444420e8:encoding5:UTF-84:infod6:lengthi59616eee");

                const torrentFile = parser.parse();

                expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
                expect(torrentFile.comment).toBe("Comment goes here");
                expect(torrentFile.createdBy).toBe("Transmission/2.92 (14714)");
                expect(torrentFile.creationDate).toBe(1460444420);
                expect(torrentFile.encoding).toBe("UTF-8");
                expect(torrentFile.info.length).toBe(59616);
            })
        })

        describe('when parse info.name', () => {
            it('parses info.name', () => {
                (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)13:creation datei1460444420e8:encoding5:UTF-84:infod6:lengthi59616e4:name9:lorem.txtee");

                const torrentFile = parser.parse();

                expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
                expect(torrentFile.comment).toBe("Comment goes here");
                expect(torrentFile.createdBy).toBe("Transmission/2.92 (14714)");
                expect(torrentFile.creationDate).toBe(1460444420);
                expect(torrentFile.encoding).toBe("UTF-8");
                expect(torrentFile.info.length).toBe(59616);
                expect(torrentFile.info.name).toBe("lorem.txt");
            })
            })

            it.each`
                content                                                                          | description
                ${"d8:announce33:http://192.168.1.74:6969/announce4:infod4:name9:lorem.txtee"}   | ${'missing length field'}
                ${"d8:announce33:http://a/announce4:infod6:lenghti12345ee"}                      | ${'misspelled as "lenght"'}
                ${"d8:announce33:http://a/announce4:infod6:lengthiee"}                           | ${'no number after i'}
                ${"d8:announce33:http://a/announce4:infod6:lengthi-42ee"}                        | ${'negative number'}
                ${"d8:announce33:http://a/announce4:infod6:lengthi0ee"}                          | ${'zero value'}
                ${"d8:announce33:http://a/announce4:infod6:lengthinotnumberee"}                  | ${'not a number'}
                ${"d8:announce33:http://a/announce4:infod6:length42e4:name9:lorem.txtee"}        | ${'missing "i" before number'}
                ${"d8:announce33:http://a/announce4:infod6:lengthi999999999ee"}                  | ${'very large value'}
                ${"d8:announce33:http://a/announce4:infod6:lengthi44e6:lengthi22ee"}             | ${'two length fields, picks first'}
                ${"d8:announce33:http://a/announcee"}                                            | ${'no info dict at all'}
                ${"d8:announce33:http://a/announce4:infod4:name9:lorem.txte"}                    | ${'malformed info dict (unclosed)'}
                ${"d8:announce33:http://a/announce4:infod6:lengthi6e4:name9:a.txteq"}            | ${'extra data after valid length'}
            `('returns 0 for info.length when $description', (content: string) => {
                (fileReader.read as any).mockReturnValue(content);
                const torrentFile = parser.parse();
                expect(torrentFile.info.length).toBe(0);
            });
        })

});