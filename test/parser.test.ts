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
          `('returns empty createdBy when it is malformed', (content: string) => {
            (fileReader.read as any).mockReturnValue(content);

            const torrentFile = parser.parse();

            expect(torrentFile.createdBy).toBe("");
        })
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
            `('returns empty encoding when encoding field is malformed or missing [content: %s]', (content: string) => {
                (fileReader.read as any).mockReturnValue(content);

                const torrentFile = parser.parse();

                expect(torrentFile.encoding).toBe("");
    });

        describe('when parse info.private', () => {
            it('returns info.piece length', () => {
                (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)13:creation datei1460444420e8:encoding5:UTF-84:infod6:lengthi59616e4:name9:lorem.txt12:piece lengthi32768e7:privatei1eee");

                const torrentFile = parser.parse();

                expect(torrentFile.info.private).toBe(true);
            })

            it.each`
                content                                                                           | description
                ${"d4:infod7:privatei0eeee"}                                                      | ${'private present, set to 0'}
                ${"d4:infod6:lengthi1337e4:name4:testee"}                                         | ${'no private field (absent)'}
                ${"d4:infod7:privatei9eeee"}                                                      | ${'private present, invalid value 9'}
                ${"d4:infod7:privateieee"}                                                        | ${'private present, but missing value'}
                ${"d7:privatei0eee"}                                                              | ${'two private fields, picks first'}
                ${"d4:infod6:lengthi59616e4:name9:lorem.txt12:piece lengthi32768e7:privatei0eee"} | ${'realistic full input, private 0'}
            `('returns false for info.private when it is malformed', (content: string) => {
                (fileReader.read as any).mockReturnValue(content);

                const torrentFile = parser.parse();

                expect(torrentFile.info.private).toBe(false);
             });
        })
    })
});
