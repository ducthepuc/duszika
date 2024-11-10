import { useState } from 'react';
import './creator.scss';

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
            content: type === 'lesson' ? [{ type: 'text-block', text: '' }] : [],
            questionText: '',
            questionType: type === 'true-false' ? 'true-false' : 'multiple-choice',
            answers: [],
        };
        setSteps([...steps, newStep]);
        setIsDropdownOpen(false);
    };

    const handleStepChange = (index, field, value) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const addAnswerOption = (stepIndex) => {
        const newSteps = [...steps];
        newSteps[stepIndex].answers.push({ text: '', correct: false });
        setSteps(newSteps);
    };

    const removeAnswerOption = (stepIndex, answerIndex) => {
        const newSteps = [...steps];
        newSteps[stepIndex].answers.splice(answerIndex, 1);
        setSteps(newSteps);
    };

    const handleAnswerChange = (stepIndex, answerIndex, value) => {
        const newSteps = [...steps];
        newSteps[stepIndex].answers[answerIndex].text = value;
        setSteps(newSteps);
    };

    const toggleCorrectAnswer = (stepIndex, answerIndex) => {
        const newSteps = [...steps];
        newSteps[stepIndex].answers[answerIndex].correct = !newSteps[stepIndex].answers[answerIndex].correct;
        setSteps(newSteps);
    };

    const removeStep = (stepIndex) => {
        const newSteps = [...steps];
        newSteps.splice(stepIndex, 1);
        setSteps(newSteps);
    };

    const saveCourse = () => {
        const courseData = {
            title,
            description,
            elements: steps.map(step => {
                if (step.type === 'lesson') {
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
                        questionType: step.questionType,
                        questionText: step.questionText,
                        answers: step.answers.map(answer => ({
                            text: answer.text,
                            correct: answer.correct,
                        })),
                    };
                }
            }),
        };

        const courseJson = JSON.stringify(courseData, null, 2);
        const blob = new Blob([courseJson], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title || 'course'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

                    {step.type === 'lesson' && (
                        <div>
                            <h3>Lesson Content</h3>
                            {step.content.map((contentItem, contentIndex) => (
                                <div key={contentIndex} style={{ marginBottom: '10px' }}>
                                    <textarea
                                        placeholder="Lesson Text"
                                        value={contentItem.text}
                                        onChange={(e) => {
                                            const newSteps = [...steps];
                                            newSteps[stepIndex].content[contentIndex].text = e.target.value;
                                            setSteps(newSteps);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {step.type === 'question' && (
                        <div>
                            <h3>{step.questionType === 'true-false' ? 'True/False Question' : 'Multiple Choice Question'}</h3>
                            <input
                                type="text"
                                placeholder="Question Text"
                                value={step.questionText}
                                onChange={(e) => handleStepChange(stepIndex, 'questionText', e.target.value)}
                            />
                            {step.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        placeholder={`Answer ${answerIndex + 1}`}
                                        value={answer.text}
                                        onChange={(e) => handleAnswerChange(stepIndex, answerIndex, e.target.value)}
                                    />
                                    <input
                                        type={step.questionType === 'true-false' ? 'radio' : 'checkbox'}
                                        checked={answer.correct}
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
                        <div onClick={() => addStep('lesson')} style={{ padding: '8px', cursor: 'pointer' }}>Lesson</div>
                        <div onClick={() => addStep('question')} style={{ padding: '8px', cursor: 'pointer' }}>Question</div>
                    </div>
                )}
            </div>

            <button onClick={saveCourse}>Save Course</button>
        </div>
    );
}

export default CourseCreator;