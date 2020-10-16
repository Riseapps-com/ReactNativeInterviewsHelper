import { QuestionData, TopicDuration } from './types'
import fs from 'fs'
import interviewQuestions from './wrappers/interviewQuestions'
import config from './wrappers/config'
import input from './wrappers/input'
import { wrapToOutputsDirectory } from './utils/createOutputsDirectory'
import interview from './wrappers/interview'

const isSuitableForTrainee = (requiredFor: string): boolean => requiredFor === 'trainee'

const isSuitableForJunior = (requiredFor: string): boolean =>
    requiredFor === 'trainee' || requiredFor === 'junior'

const isSuitableForJuniorPlus = (requiredFor: string): boolean =>
    requiredFor === 'trainee' || requiredFor === 'junior' || requiredFor === 'junior+'

const isSuitableForMiddleMinus = (requiredFor: string): boolean =>
    requiredFor === 'trainee' ||
    requiredFor === 'junior' ||
    requiredFor === 'junior+' ||
    requiredFor === 'middle-'

const isSuitableForMiddle = (requiredFor: string): boolean =>
    requiredFor === 'trainee' ||
    requiredFor === 'junior' ||
    requiredFor === 'junior+' ||
    requiredFor === 'middle-' ||
    requiredFor === 'middle'

const isSuitableForMiddlePlus = (requiredFor: string): boolean =>
    requiredFor === 'trainee' ||
    requiredFor === 'junior' ||
    requiredFor === 'junior+' ||
    requiredFor === 'middle-' ||
    requiredFor === 'middle' ||
    requiredFor === 'middle+'

const isSuitableForSenior = (requiredFor: string): boolean =>
    requiredFor === 'trainee' ||
    requiredFor === 'junior' ||
    requiredFor === 'junior+' ||
    requiredFor === 'middle-' ||
    requiredFor === 'middle' ||
    requiredFor === 'middle+' ||
    requiredFor === 'senior'

const isSuitableQuestion = (role: string, requiredFor: string): boolean => {
    let isSuitable: boolean = false

    switch (role) {
        case 'trainee':
            isSuitable = isSuitableForTrainee(requiredFor)
            break
        case 'junior':
            isSuitable = isSuitableForJunior(requiredFor)
            break
        case 'junior+':
            isSuitable = isSuitableForJuniorPlus(requiredFor)
            break
        case 'middle-':
            isSuitable = isSuitableForMiddleMinus(requiredFor)
            break
        case 'middle':
            isSuitable = isSuitableForMiddle(requiredFor)
            break
        case 'middle+':
            isSuitable = isSuitableForMiddlePlus(requiredFor)
            break
        case 'senior':
            isSuitable = isSuitableForSenior(requiredFor)
            break
    }

    return isSuitable
}

const formatQuestions = (questionsMap: Map<TopicDuration, QuestionData[]>): string => {
    const topics: string[] = []
    questionsMap.forEach((value, key) => {
        const questions: string[] = value.map(
            (question, index) =>
                `${index + 1}. ${question.question} (timeForAnswer: ${
                    question.estimatedTimeMin
                } min) (requiredFor: ${question.requiredFor}) (key: ${config.questionKey}${
                    question.key
                }${config.questionKey})`,
        )
        topics.push(
            `${config.topicKey}${key.label}${config.topicKey} ≈${
                key.questionsNumber
            } questions\n${questions.join('\n')}`,
        )
    })
    return topics.join('\n')
}

const findSuitableQuestions = (): void => {
    console.log(`findSuitableQuestions()`)

    const questionsMap = new Map<TopicDuration, QuestionData[]>()

    input.includedTopics.forEach((topic) => {
        const globalTopic: string = topic.includes('.') ? topic.split('.')[0] : topic
        let suitableQuestions: QuestionData[] = interviewQuestions[
            topic
        ].data.filter((item: QuestionData) => isSuitableQuestion(input.role, item.requiredFor))
        suitableQuestions.length && questionsMap.set(interview.topics[globalTopic], suitableQuestions)
    })

    fs.writeFileSync(
        wrapToOutputsDirectory(config.questionsFilename),
        formatQuestions(questionsMap),
    )
}

export { findSuitableQuestions }
