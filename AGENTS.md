# AGENTS.md

## Overview

This project implements a BitTorrent `.torrent` file parser and a set of utilities for reading and interpreting torrent metadata. The agent under test ensures robust and fail-safe parsing for common and edge-case .torrent file structures, including detection and rejection of malformed or malicious files.

## Responsibilities

- Read `.torrent` files using flexible file reader abstraction.
- Parse top-level keys such as `announce`, `info`, `name`, `length`, and `piece length` according to the BitTorrent specification (BEP-0003).
- Detect malformed torrent files (e.g., missing or incorrectly encoded required top-level dictionary) and safely return an "empty" torrent file object.
- Expose a type-safe interface (`TorrentFile`) for consuming torrent metadata.

## Usage

- Main entry point: Instantiate a `Parser` with appropriate configuration and a `FileReader` implementation.
- Call `Parser.parse()` to parse the torrent file and retrieve a `TorrentFile`.
- The parser will return a default, empty `TorrentFile` if the file is missing, empty, or malformed (does not start with the expected dictionary marker).

## Testing

- Tests cover successful parsing, empty files, and files with parsing errors.
- All tests can be run via the command:
  ```sh
  npm run test
  ```

## File List

- `src/parser.ts`: Torrent metadata parser
- `src/torrentFile.ts`: In-memory torrent metadata representation
- `src/fileReader.ts`: File reading abstraction
- `src/configuration.ts`: Runtime configuration

---

This file documents the agent’s purpose and main behaviors for collaboration and maintenance.
