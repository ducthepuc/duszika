import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import styles from './Viewer.module.scss';  // Import styles as a module
import ReactDOM from 'react-dom';
import { Checkbox, Radio, Switch } from 'pretty-checkbox-react';

import '@djthoms/pretty-checkbox';

const courseData = {
  title: "example",
  description: "none",
  elements: [
    {
      type: "lesson",
      content: [
        {
          type: "text-block",
          text: "lesson 1"
        }
      ]
    },
    {
      type: "question",
      questionType: "multiple-choice",
      questionText: "question 1",
      answers: [
        {
          text: "answer 1",
          correct: true
        },
        {
          text: "answer 2",
          correct: false
        }
      ]
    }
  ]
};

function Viewer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

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
        <div key={index} className={styles.card}>
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
        <div key={index} className={styles.card}>
          <p>{element.questionText}</p>
          {element.answers.map((answer, ansIndex) => (
            <div className={styles.checkboxWrapper} key={ansIndex}>
              <input
                id={`answer-${index}-${ansIndex}`}
                className={styles.substituted}
                type={element.questionType === "true-false" ? "radio" : "checkbox"}
                name={`question-${index}`}
                aria-hidden="true"
                checked={answers[index] === ansIndex}
                onChange={() => handleAnswerSelect(index, ansIndex)}
              />
              <label htmlFor={`answer-${index}-${ansIndex}`}>
                {answer.text}
              </label>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.viewerContainer}>
      <h1>{courseData.title}</h1>
      <p>{courseData.description}</p>

      {renderElement(courseData.elements[currentIndex], currentIndex)}

      <div>
        <button onClick={handleBack} disabled={currentIndex === 0}>
          Back
        </button>
        <button onClick={handleNext} disabled={currentIndex === courseData.elements.length - 1}>
          Continue
        </button>
      </div>

      <button onClick={calculateScore}>Submit Quiz</button>
      <p>Your score: {score} / {courseData.elements.filter(e => e.type === "question").length}</p>
    </div>
  );
}

export default Viewer;
