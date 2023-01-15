import { readdir } from "fs/promises"
import * as path from "path"
import { env } from "process"
const Database = require('better-sqlite3');

type HighlightLocation = {
    chapter: string,
    section: string,
}

type Highlight = {
    text: string,
    note: string,
    location: HighlightLocation,
    timestamp: string,
    id: string,
}

type BookMeta = {
    title: string,
    author: string,
    id: string,
}

const IBookDocumentDir: string = `${env.HOME}/Library/Containers/com.apple.iBooksX/Data/Documents/`
const libraryMetaDb = new Database(`${IBookDocumentDir}/BKLibrary-1-091020131601.sqlite`, { verbose: console.log, nativeBinding: "node-file/better-sqlite3.node" })
export class IBooksData {

    allBookMeta(): BookMeta[] {
        this.findDbFile(path.join(IBookDocumentDir, "BKLibrary")).then(
            dbFile => {
                console.log(dbFile)
                let stmt = libraryMetaDb.prepare(
                    // "SELECT ZTITLE as title, ZAUTHOR as author, ZASSETID as id FROM ZBKLIBRARYASSET")
                    "SELECT * from sqlite_master;")
                console.log(stmt.get())
                for (let book in stmt.iterate()) {
                    console.log(book);
                }
            }
        ).catch(error => {
            console.error(error);
            throw error;
        })
        return [];
    }

    async findDbFile(folder: string): Promise<string> {
        let files = await readdir(folder).then();
        return path.resolve(folder, files.filter(file => file.endsWith(".sqlite"))[0]);
    }
}