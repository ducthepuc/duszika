import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactDOM from 'react-dom';
import { Checkbox, Radio, Switch } from 'pretty-checkbox-react';
import { Link, useNavigate } from 'react-router-dom';

import '@djthoms/pretty-checkbox';

function Viewer() {
  const { courseTitle } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      console.log("Fetching course data for:", courseTitle);

      try {
        const response = await fetch(`/api/courses/${courseTitle}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch course data: ${response.statusText}`);
        }
        const data = await response.json();
        setCourseData(data);
        console.log('Course data fetched successfully:', data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [courseTitle]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: answerIndex
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    courseData.elements.forEach((element, index) => {
      if (element.type === "question") {
        const selectedAnswerIndex = answers[index];
        if (selectedAnswerIndex !== undefined) {
          const selectedAnswer = element.answers[selectedAnswerIndex];
          if (selectedAnswer.correct) {
            totalScore += 1;
          }
        }
      }
    });
    setScore(totalScore);
    console.log(totalScore);
  };

  const handleNext = () => {
    if (currentIndex < courseData.elements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const [editorHeight, setEditorHeight] = useState(300);

  const renderElement = (element, index) => {
    if (element.type === "lesson") {
      return (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          {element.content.map((content, idx) => {
            if (content.type === "text-block") {
              return <p key={idx}>{content.text}</p>;
            } else if (content.type === "code-block") {
              const whenMount = (e) => {
                e.updateOptions({ contextmenu: false });
                setEditorHeight(content.envCode.split("\n").length * 50);
              };
              return (
                <Editor
                  key={idx}
                  defaultLanguage={content.envLang}
                  value={content.envCode}
                  width="95%"
                  height={`${editorHeight}px`}
                  onMount={whenMount}
                  options={{
                    cursorStyle: "line",
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    contextmenu: false,
                    formatOnType: true
                  }}
                  theme="vs-dark"
                />
              );
            }
            return null;
          })}
        </div>
      );
    } else if (element.type === "question") {
      return (
        <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
          <p>{element.questionText}</p>
          {element.answers.map((answer, ansIndex) => (
            <div style={{ marginBottom: '10px' }} key={ansIndex}>
              <input
                id={`answer-${index}-${ansIndex}`}
                style={{ marginRight: '10px' }}
                type={element.questionType === "true-false" ? "radio" : "checkbox"}
                name={`question-${index}`}
                aria-hidden="true"
                checked={answers[index] === ansIndex}
                onChange={() => handleAnswerSelect(index, ansIndex)}
              />
              <label htmlFor={`answer-${index}-${ansIndex}`} style={{ cursor: 'pointer' }}>
                {answer.text}
              </label>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <p>Loading course...</p>;
  }

  if (!courseData) {
    return <p>Course data not found</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>{courseData.title}</h1>
      <p>{courseData.description}</p>

      {renderElement(courseData.elements[currentIndex], currentIndex)}

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleBack} disabled={currentIndex === 0} style={{ marginRight: '10px', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
          Back
        </button>
        <button onClick={handleNext} disabled={currentIndex === courseData.elements.length - 1} style={{ padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
          Continue
        </button>
      </div>

      <button onClick={calculateScore} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
        Submit Quiz
      </button>
      <p>Your score: {score} / {courseData.elements.filter(e => e.type === "question").length}</p>
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

export default Viewer;
