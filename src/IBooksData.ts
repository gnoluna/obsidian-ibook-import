import { readdirSync, readFileSync } from "fs"
import * as path from "path"
import { env } from "process"
//eslint-disable-next-line @typescript-eslint/no-var-requires
const initSqlJs = require('sql.js');  

type HighlightLocation = {
    chapter: string,
    section: string,
}

type Highlight = {
    text: string,
    note: string,
    location: HighlightLocation,
    timestamp: string,
    bookId: string,
}

type BookMeta = {
    title: string,
    author: string,
    id: string,
}
const IBookDocumentDir = `${env.HOME}/Library/Containers/com.apple.iBooksX/Data/Documents/`

export class IBooksData {
    libraryMetaDbFile;
    annotationDbFile;

    constructor() {
        this.libraryMetaDbFile = this.findDbFile(path.join(IBookDocumentDir, "BKLibrary"));
        this.annotationDbFile = this.findDbFile(path.join(IBookDocumentDir, "AEAnnotation"));
    }

    async loadSQL() {
        return await initSqlJs({ locateFile: (file: string) => `https://sql.js.org/dist/${file}` })
    }

    async allBookMeta(): Promise<BookMeta[]> {
        const SQL = await this.loadSQL()
        const db = new SQL.Database(readFileSync(this.libraryMetaDbFile))
        return db.exec(
            "SELECT ZTITLE as title, ZAUTHOR as author, ZASSETID as id FROM ZBKLIBRARYASSET") as BookMeta[]

    }

    async allHighlights(): Promise<Highlight[]> {
        const SQL = await this.loadSQL()
        const db = new SQL.Database(readFileSync(this.libraryMetaDbFile))
        return db.exec(
            `select ZANNOTATIONASSETID as bookId,
            ZANNOTATIONSELECTEDTEXT as text,
            ZANNOTATIONNOTE as note,
            ZANNOTATIONMODIFICATIONDATE as timestamp
            from ZAEANNOTATION`) as Highlight[]
    }

    findDbFile(folder: string): string {
        return path.join(folder, readdirSync(folder).filter(file => file.endsWith(".sqlite"))[0]);
    }
}