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
            content                                                          | description
            ${"d25:Transmission/2.92 (14714):creation datei1460444420ee"}    | ${'missing field length before creation date'}
            ${"d25:Transmission/2.92 (14714)13creation datei1460444420ee"}   | ${'missing colon before creation date'}
            ${"d25:Transmission/2.92 (14714)13:crea datei1460444420ee"}      | ${'typo in creation date field name'}
            ${"d25:Transmission/2.92 (14714)13:i1460444420ee"}               | ${'missing field key before integer'}
            ${"d25:Transmission/2.92 (14714)13:creation date1460444420ee"}   | ${'missing "i" before integer'}
            ${"d25:Transmission/2.92 (14714)13:creation datei1460444420ge"}  | ${'trailing invalid character after integer'}
            ${"d25:Transmission/2.92 (14714)13:creation datei1460444420e"}   | ${'correct field but no enclosing dictionary'}
          `('returns empty when $description', (content: string) => {
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
            content                                               | description
            ${"d8:announce33:http://a/announce8encoding5:UTF-8e"} | ${'missing colon in field key'}
            ${"d8:announce33:http://a/announce8:encoding5UTF-8e"} | ${'missing colon before encoding value'}
            ${"d8:announce33:http://a/announce8:encoding:UTF-8e"} | ${'double colon in field'}
            ${"d8:announce33:http://a/announce8:encodinge"}       | ${'missing value for encoding'}
            ${"d8:announce33:http://a/announceencoding5:UTF-8e"}  | ${'bad encoding key spelling'}
            ${"d8:encodinge"}                                     | ${'no fields other than encoding, and no value'}
            ${"d8:encoding0:e"}                                   | ${'encoding with zero-length value'}
            ${"d8:encoding5:e"}                                   | ${'field value ends with colon'}
            `('returns empty encoding when $description', (content: string) => {
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
            `('returns 0 for info.length when $description', (content: string) => {
                (fileReader.read as any).mockReturnValue(content);

                const torrentFile = parser.parse();

                expect(torrentFile.info.length).toBe(0);
            });
        })

        describe('when parse info.name', () => {
            it('returns info.name', () => {
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

            it.each`
                content                                                                     | description
                ${"d8:announce33:http://a/announce4:infod6:lengthi660ee"}                   | ${'missing name field'}
                ${"d8:announce33:http://a/announce4:infod4:nmae9:lorem.txt6:lengthi33ee"}   | ${'misspelled as nmae'}
                ${"d8:announce33:http://a/announce4:infod4:name0:6:lengthi33ee"}            | ${'zero-length name'}
                ${"d8:announce33:http://a/announce4:infod4:nameXe6:lengthi12ee"}            | ${'not a number as length'}
                ${"d8:announce33:http://a/announce4:infod4:name9lorem.txt6:lengthi22ee"}    | ${'missing colon after length'}
                ${"d8:announce33:http://a/announce4:infod4:name15:lorem.tx6:lengthi33ee"}   | ${'declared name field longer than value'}
                ${"d8:announce33:http://a/announce4:infod4:name9:6:lengthi33ee"}            | ${'missing actual value'}
                ${"d8:announce33:http://a/announce4:infod4:name9:lorem.txt4:name5:abcdeee"} | ${'two name fields; picks first'}
            `('returns empty info.name when $description', (content: string) => {
                (fileReader.read as any).mockReturnValue(content);

                const torrentFile = parser.parse();

                expect(torrentFile.info.name).toBe("");
            });
        })

        describe('when parse info.piece length', () => {
            it('returns info.piece length', () => {
                (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)13:creation datei1460444420e8:encoding5:UTF-84:infod6:lengthi59616e4:name9:lorem.txt12:piece lengthi32768eee");

                const torrentFile = parser.parse();

                expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
                expect(torrentFile.comment).toBe("Comment goes here");
                expect(torrentFile.createdBy).toBe("Transmission/2.92 (14714)");
                expect(torrentFile.creationDate).toBe(1460444420);
                expect(torrentFile.encoding).toBe("UTF-8");
                expect(torrentFile.info.length).toBe(59616);
                expect(torrentFile.info.name).toBe("lorem.txt");
                expect(torrentFile.info.pieceLength).toBe(32768);
            });

            it.each`
                content                                                                            | description
                ${"d4:infod6:lengthi123e4:name8:foo.txtee"}                                        | ${'missing piece length field'}
                ${"d4:infod6:lengthi123e4:name8:foo.txt14:piece lenghti32768eee"}                  | ${'misspelled as piece lenght'}
                ${"d4:infod6:lengthi123e4:name8:foo.txt12:piece lengthieee"}                       | ${'no number after i'}
                ${"d4:infod6:lengthi123e4:name8:foo.txt12:piece lengthi-42eee"}                    | ${'negative value'}
                ${"d4:infod6:lengthi123e4:name8:foo.txt12:piece lengthinotnumeee"}                 | ${'not a number'}
                ${"d4:infod6:lengthi123e4:name8:foo.txt12:piece lengthi0eee"}                      | ${'zero value'}
                ${"d4:infod6:lengthi123e4:name8:foo.txt12:piece lengthi999999999eee"}              | ${'very large value'}
                ${"d4:infod6:lengthi123e4:name8:foo.txt12:piece lengthi44e12:piece lengthi22eee"}  | ${'two piece length fields, picks first'}
                ${"d8:announce33:http://a/announce4:infod12:piece lengthi32768e"}                  | ${'incomplete info dict (no closing)'}
            `('parses info.piece length edge (${description})', (content: string) => {
                (fileReader.read as any).mockReturnValue(content);

                const torrentFile = parser.parse();

                expect(torrentFile.info.pieceLength).toBe(0);
            });
        })
    })

    describe('when parse info.private', () => {
        it('returns info.private', () => {
            (fileReader.read as any).mockReturnValue("d8:announce33:http://192.168.1.74:6969/announce7:comment17:Comment goes here10:created by25:Transmission/2.92 (14714)13:creation datei1460444420e8:encoding5:UTF-84:infod6:lengthi59616e4:name9:lorem.txt12:piece lengthi32768e7:privatei1eee");

            const torrentFile = parser.parse();

            expect(torrentFile.announce).toBe("http://192.168.1.74:6969/announce");
            expect(torrentFile.comment).toBe("Comment goes here");
            expect(torrentFile.createdBy).toBe("Transmission/2.92 (14714)");
            expect(torrentFile.creationDate).toBe(1460444420);
            expect(torrentFile.encoding).toBe("UTF-8");
            expect(torrentFile.info.length).toBe(59616);
            expect(torrentFile.info.name).toBe("lorem.txt");
            expect(torrentFile.info.pieceLength).toBe(32768);
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
            `('parses info.private edge (${description})', ({ content, description }) => {
            (fileReader.read as any).mockReturnValue(content);

            const torrentFile = parser.parse();

            expect(torrentFile.info.private).toBe(false);
        });
    })
})