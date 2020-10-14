import fs from 'fs'
import config from './config'

const parseResultDraft = (): Map<string, number[]> => {
    const parsedResultDraft = new Map<string, number[]>()

    const rows: string[] = fs
        .readFileSync(config.resultDraftFilepath, 'utf8')
        .split('\n')
        .filter((row) => row)

    let currentTopic: string

    rows.forEach((row) => {
        if (row.includes('@topic@')) {
            currentTopic = row.split(' @topic@')[0]
        } else {
            const mark: number = Number(row.split(') ')[1])
            if (parsedResultDraft.get(currentTopic)) {
                parsedResultDraft.set(currentTopic, [...parsedResultDraft.get(currentTopic), mark])
            } else {
                parsedResultDraft.set(currentTopic, [mark])
            }
        }
    })

    return parsedResultDraft
}

export { parseResultDraft }
