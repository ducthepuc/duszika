import { useState } from 'react';

export function useSteps() {
    const [steps, setSteps] = useState([]);

    const addStep = (type) => {
        const newStep = {
            type,
            task: '',
            help: '',
            exampleCode: '',
            acceptedAnswers: [],
        };

        if (type === 'question') {
            newStep.questionText = '';
            newStep.answers = [];
        } else if (type === 'lesson') {
            newStep.content = [{
                type: 'text-block',
                text: ''
            }];
        }

        setSteps([...steps, newStep]);
    };

    const removeStep = (stepIndex) => {
        const newSteps = [...steps];
        newSteps.splice(stepIndex, 1);
        setSteps(newSteps);
    };

    const updateStep = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    return {
        steps,
        setSteps,
        addStep,
        removeStep,
        updateStep
    };
}