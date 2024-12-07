import { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";

function CourseCreator() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

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

    const saveCourse = async () => {
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

        try {
            const response = await fetch('/api/file_upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Course saved successfully:', result);
                alert('Course saved successfully!');
            } else {
                const error = await response.json();
                console.error('Failed to save course:', error);
                alert(`Failed to save course: ${error.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            alert('An error occurred while saving the course.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Create a New Course</h2>

            <input
                type="text"
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />
            <textarea
                placeholder="Course Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px',
                    marginBottom: '15px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                }}
            />

            {steps.map((step, stepIndex) => (
                <div key={stepIndex} style={{ border: '1px solid #ddd', margin: '10px', padding: '10px' }}>
                    <button onClick={() => removeStep(stepIndex)} style={{ float: 'right', color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Delete Step</button>

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
                                        style={{
                                            width: '100%',
                                            padding: '10px',
                                            marginBottom: '15px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
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
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    marginBottom: '15px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                            />
                            {step.answers.map((answer, answerIndex) => (
                                <div key={answerIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder={`Answer ${answerIndex + 1}`}
                                        value={answer.text}
                                        onChange={(e) => handleAnswerChange(stepIndex, answerIndex, e.target.value)}
                                        style={{
                                            width: '70%',
                                            padding: '10px',
                                            marginRight: '10px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                        }}
                                    />
                                    <input
                                        type={step.questionType === 'true-false' ? 'radio' : 'checkbox'}
                                        checked={answer.correct}
                                        onChange={() => toggleCorrectAnswer(stepIndex, answerIndex)}
                                    />
                                    <button onClick={() => removeAnswerOption(stepIndex, answerIndex)} style={{ color: 'red', marginLeft: '5px', background: 'none', border: 'none', cursor: 'pointer' }}>X</button>
                                </div>
                            ))}
                            <button
                                onClick={() => addAnswerOption(stepIndex)}
                                style={{
                                    padding: '8px 12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginBottom: '10px',
                                }}
                            >
                                Add Answer Option
                            </button>
                        </div>
                    )}
                </div>
            ))}

            <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                    onClick={toggleDropdown}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    Add Step
                </button>
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
                        <div
                            onClick={() => addStep('lesson')}
                            style={{ padding: '8px', cursor: 'pointer', textAlign: 'center' }}
                        >
                            Lesson
                        </div>
                        <div
                            onClick={() => addStep('question')}
                            style={{ padding: '8px', cursor: 'pointer', textAlign: 'center' }}
                        >
                            Question
                        </div>
                    </div>
                )}
            </div>
            <br />
            <button
                onClick={saveCourse}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '20px',
                }}
            >
                Save Course
            </button>
            <br />
            <button
                onClick={() => navigate('/homepage')}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#FF0000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: '20px',
                }}
            >
                Back to homepage
            </button>
        </div>
    );
}

export default CourseCreator;
