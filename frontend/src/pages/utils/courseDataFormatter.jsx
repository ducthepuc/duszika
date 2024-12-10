export const formatCourseData = (title, description, steps) => {
    return {
        title,
        description,
        elements: steps.map(step => {
            if (step.type === 'code-task') {
                return {
                    type: step.type,
                    task: step.task,
                    help: step.help,
                    exampleCode: step.exampleCode,
                    acceptedAnswers: step.acceptedAnswers.map(answer => answer.code)
                };
            } else if (step.type === 'lesson') {
                return {
                    type: 'lesson',
                    content: step.content.map(contentItem => ({
                        type: contentItem.type,
                        text: contentItem.text,
                    })),
                };
            } else if (step.type === 'question') {
                return {
                    type: 'question',
                    questionText: step.questionText,
                    answers: step.answers.map(answer => ({
                        text: answer.text,
                        correct: answer.correct,
                    })),
                };
            }
            return step;
        })
    };
};