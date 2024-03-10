"use strict"

import { FileReader } from "../src/fileReader";
import { Parser } from '../src/parser'
import { mock } from 'vitest-mock-extended';
import { describe, beforeEach, it, expect } from "vitest";
import { TorrentFile } from "../src/torrentFile";

describe('parser', function(){
    let fileReader : FileReader;
    let parser : Parser;

    beforeEach(function(){
        fileReader = mock<FileReader>();
    });

    it('returns an empty torrent, when file is null', function(){
        fileReader.read.mockReturnValue("");
        parser = new Parser(fileReader);

        const torrentFile = parser.parse();

        expect(torrentFile).toBeInstanceOf(TorrentFile);
        expect(torrentFile.getInfoHash()).toBe("");
        expect(torrentFile.getName()).toBe("");
    });
});