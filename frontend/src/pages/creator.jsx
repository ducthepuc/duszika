import { useState } from 'react';

function CourseCreator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const addStep = (type) => {
        const newStep = {
            type,
            instruction: '',
            question: '',
            answers: type === 'regular' ? [''] : [],
            correctAnswer: type === 'true-false' ? null : [],
        };
        setSteps([...steps, newStep]);
        setIsDropdownOpen(false);
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const addAnswerOption = (index) => {
        const newSteps = [...steps];
        newSteps[index].answers.push('');
        setSteps(newSteps);
    };

    const removeAnswerOption = (stepIndex, answerIndex) => {
        const newSteps = [...steps];
        newSteps[stepIndex].answers.splice(answerIndex, 1);
        setSteps(newSteps);
    };

    const handleAnswerChange = (stepIndex, answerIndex, value) => {
        const newSteps = [...steps];
        newSteps[stepIndex].answers[answerIndex] = value;
        setSteps(newSteps);
    };

    const toggleCorrectAnswer = (stepIndex, answerIndex) => {
        const newSteps = [...steps];
        if (newSteps[stepIndex].type === 'single-choice') {
            newSteps[stepIndex].correctAnswer = answerIndex;
        } else if (newSteps[stepIndex].type === 'multiple-choice') {
            const correctAnswers = newSteps[stepIndex].correctAnswer;
            if (correctAnswers.includes(answerIndex)) {
                newSteps[stepIndex].correctAnswer = correctAnswers.filter(i => i !== answerIndex);
            } else {
                newSteps[stepIndex].correctAnswer.push(answerIndex);
            }
        }
        setSteps(newSteps);
    };

    const removeStep = (stepIndex) => {
        const newSteps = [...steps];
        newSteps.splice(stepIndex, 1);
        setSteps(newSteps);
    };

    return (
        <div>
            <h2>Create a New Course</h2>

            <input
                type="text"
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
                placeholder="Course Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {steps.map((step, stepIndex) => (
                <div key={stepIndex} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
                    <button onClick={() => removeStep(stepIndex)} style={{ float: 'right', color: 'red' }}>Delete Step</button>

                    {step.type === 'regular' && (
                        <div>
                            <h3>Instruction + Multiple Answers</h3>
                            <textarea
                                placeholder="Instruction"
                                value={step.instruction}
                                onChange={(e) => handleStepChange(stepIndex, 'instruction', e.target.value)}
                            />
                            {step.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder={`Acceptable Answer ${answerIndex + 1}`}
                                        value={answer}
                                        onChange={(e) => handleAnswerChange(stepIndex, answerIndex, e.target.value)}
                                    />
                                    <button onClick={() => removeAnswerOption(stepIndex, answerIndex)} style={{ color: 'red', marginLeft: '5px' }}>X</button>
                                </div>
                            ))}
                            <button onClick={() => addAnswerOption(stepIndex)}>Add Another Acceptable Answer</button>
                        </div>
                    )}

                    {step.type === 'true-false' && (
                        <div>
                            <h3>True/False Question</h3>
                            <input
                                type="text"
                                placeholder="Question"
                                value={step.question}
                                onChange={(e) => handleStepChange(stepIndex, 'question', e.target.value)}
                            />
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        checked={step.correctAnswer === true}
                                        onChange={() => handleStepChange(stepIndex, 'correctAnswer', true)}
                                    />
                                    True
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        checked={step.correctAnswer === false}
                                        onChange={() => handleStepChange(stepIndex, 'correctAnswer', false)}
                                    />
                                    False
                                </label>
                            </div>
                        </div>
                    )}

                    {step.type === 'single-choice' && (
                        <div>
                            <h3>Single-Choice Question</h3>
                            <input
                                type="text"
                                placeholder="Question"
                                value={step.question}
                                onChange={(e) => handleStepChange(stepIndex, 'question', e.target.value)}
                            />
                            {step.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder={`Answer ${answerIndex + 1}`}
                                        value={answer}
                                        onChange={(e) => handleAnswerChange(stepIndex, answerIndex, e.target.value)}
                                    />
                                    <input
                                        type="radio"
                                        checked={step.correctAnswer === answerIndex}
                                        onChange={() => toggleCorrectAnswer(stepIndex, answerIndex)}
                                    />
                                    <button onClick={() => removeAnswerOption(stepIndex, answerIndex)} style={{ color: 'red', marginLeft: '5px' }}>X</button>
                                </div>
                            ))}
                            <button onClick={() => addAnswerOption(stepIndex)}>Add Answer Option</button>
                        </div>
                    )}

                    {step.type === 'multiple-choice' && (
                        <div>
                            <h3>Multiple-Choice Question</h3>
                            <input
                                type="text"
                                placeholder="Question"
                                value={step.question}
                                onChange={(e) => handleStepChange(stepIndex, 'question', e.target.value)}
                            />
                            {step.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder={`Answer ${answerIndex + 1}`}
                                        value={answer}
                                        onChange={(e) => handleAnswerChange(stepIndex, answerIndex, e.target.value)}
                                    />
                                    <input
                                        type="checkbox"
                                        checked={step.correctAnswer.includes(answerIndex)}
                                        onChange={() => toggleCorrectAnswer(stepIndex, answerIndex)}
                                    />
                                    <button onClick={() => removeAnswerOption(stepIndex, answerIndex)} style={{ color: 'red', marginLeft: '5px' }}>X</button>
                                </div>
                            ))}
                            <button onClick={() => addAnswerOption(stepIndex)}>Add Answer Option</button>
                        </div>
                    )}
                </div>
            ))}

            <div style={{ position: 'relative', display: 'inline-block' }}>
                <button onClick={toggleDropdown}>Add Step</button>
                {isDropdownOpen && (
                    <div style={{
                        position: 'absolute',
                        backgroundColor: '#333',
                        color: '#fff',
                        boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                        zIndex: 1,
                        width: '200px',
                        padding: '8px 0',
                        borderRadius: '4px',
                    }}>
                        <div onClick={() => addStep('regular')} style={{ padding: '8px', cursor: 'pointer' }}>Regular (Instruction + Answer)</div>
                        <div onClick={() => addStep('true-false')} style={{ padding: '8px', cursor: 'pointer' }}>True/False Question</div>
                        <div onClick={() => addStep('single-choice')} style={{ padding: '8px', cursor: 'pointer' }}>Single-Choice Question</div>
                        <div onClick={() => addStep('multiple-choice')} style={{ padding: '8px', cursor: 'pointer' }}>Multiple-Choice Question</div>
                    </div>
                )}
            </div>

            <button onClick={() => console.log('Saving Course...')}>Save Course</button>
        </div>
    );
}

export default CourseCreator;