export type Status = 'optional' | 'required'

export type Role = 'junior' | 'junior+' | 'middle-' | 'middle' | 'middle+' | 'senior'

export type QuestionData = {
    order: number
    key: string
    estimatedTimeMin: number
    requiredFor: Role
    question: string
}

export type Question = {
    data: QuestionData[]
    links: string[]
}

export type InterviewQuestions = {
    [key in string]: Question
}

export type TopicDuration = {
    status: Status
    durationMin: number
    label: string
    questionsNumber: number
}

export type Topics = {
    [key in string]: TopicDuration
}

export type Interview = {
    totalDurationMin: number
    topics: Topics
    requiredSections: string[]
    optionalSections: string[]
}

export type Candidate = {
    firstname: string
    lastname: string
}

export type Input = {
    role: Role
    includedTopics: string[]
    candidate: Candidate
}

export type PieChart = {
    width: number
    dataColors: string[]
    fontColor: string
    fontSize: number
    fontStyle: string
    centerFontSize: number
    dataFontColor: string
}

export type RadarChart = {
    width: number
    datasetColor: string
    datasetBackgroundColor: string
    fontSize: number
    fontColor: string
    fontStyle: string
    legendFontSize: number
    gridColor: string
    ticksBackgroundColor: string
}

export type PdfDocument = {
    creator: string
    author: string
    verticalMargin: number
    horizontalMargin: number
    logoWidth: number
    logoMargin: number
}

export type Evaluation = {
    1: string
    2: string
    3: string
    4: string
    5: string
}

export type Config = {
    notValidQuestionsFilename: string
    questionsFilename: string
    pieChartFilename: string
    radarChartFilename: string
    forInterviewerFilename: string
    resultDraftFilename: string
    resultNotesDraftFilename: string
    resultFilename: string
    suitableQuestionMarker: string
    pieChart: PieChart
    radarChart: RadarChart
    pdfDocument: PdfDocument
    maxMark: number
    topicKey: string
    notesKey: string
    recommendKey: string
    questionKey: string
    evaluation: Evaluation
}
