import React, { useState } from 'react';
import './viewer.scss'

//chatgpt course lanyok
const courseData = {
  "title": "Advanced JavaScript Concepts",
  "description": "Dive deep into JavaScript and master the core concepts, functions, and ES6+ features.",
  "elements": [
    {
      "type": "lesson",
      "content": [
        {
          "type": "text-block",
          "text": "In this lesson, we'll be exploring JavaScript functions. Functions are blocks of code designed to perform a particular task."
        },
        {
          "type": "code-block",
          "envCode": "const greet = (name) => { return `Hello, ${name}!`; }",
          "resultChecker": "userid/jsresult1"
        }
      ]
    },
    {
      "type": "lesson",
      "content": [
        {
          "type": "text-block",
          "text": "Now that we know how to create functions, let's look at JavaScript closures. A closure is the combination of a function and the lexical environment within which that function was declared."
        },
        {
          "type": "code-block",
          "envCode": "function outer() { const name = 'closure'; return function inner() { console.log(name); }; }",
          "resultChecker": "userid/jsresult2"
        }
      ]
    },
    {
      "type": "test",
      "result": "userid/jsresult3"
    },
    {
      "type": "question",
      "questionType": "multiple-choice",
      "questionText": "Which of the following is a JavaScript primitive data type?",
      "answers": [
        { "text": "String", "correct": true },
        { "text": "Array", "correct": false },
        { "text": "Object", "correct": false },
        { "text": "Function", "correct": false }
      ]
    },
    {
      "type": "question",
      "questionType": "multiple-choice",
      "questionText": "What is the result of the following expression: '10' + 5?",
      "answers": [
        { "text": "'105'", "correct": true },
        { "text": "'15'", "correct": false },
        { "text": "'10 5'", "correct": false },
        { "text": "NaN", "correct": false }
      ]
    },
    {
      "type": "question",
      "questionType": "true-false",
      "questionText": "JavaScript is a statically typed language.",
      "answers": [
        { "text": "True", "correct": false },
        { "text": "False", "correct": true }
      ]
    },
    {
      "type": "question",
      "questionType": "true-false",
      "questionText": "In JavaScript, 'null' is equivalent to 'undefined'.",
      "answers": [
        { "text": "True", "correct": false },
        { "text": "False", "correct": true }
      ]
    },
    {
      "type": "lesson",
      "content": [
        {
          "type": "text-block",
          "text": "Let's move on to JavaScript arrays. Arrays in JavaScript are list-like objects that are used to store multiple values in a single variable."
        },
        {
          "type": "code-block",
          "envCode": "let fruits = ['apple', 'banana', 'orange']; console.log(fruits[0]);",
          "resultChecker": "userid/jsresult4"
        }
      ]
    },
    {
      "type": "test",
      "result": "userid/jsresult5"
    },
    {
      "type": "question",
      "questionType": "multiple-choice",
      "questionText": "Which method is used to add a new element at the end of an array in JavaScript?",
      "answers": [
        { "text": "push()", "correct": true },
        { "text": "pop()", "correct": false },
        { "text": "shift()", "correct": false },
        { "text": "unshift()", "correct": false }
      ]
    },
    {
      "type": "question",
      "questionType": "multiple-choice",
      "questionText": "Which of the following is true about JavaScript's 'this' keyword?",
      "answers": [
        { "text": "It always refers to the current function.", "correct": false },
        { "text": "It refers to the global object in a method.", "correct": false },
        { "text": "It refers to the object that is currently executing the code.", "correct": true },
        { "text": "It refers to the last function that was invoked.", "correct": false }
      ]
    },
    {
      "type": "question",
      "questionType": "true-false",
      "questionText": "In JavaScript, the 'typeof' operator returns the data type of a value.",
      "answers": [
        { "text": "True", "correct": true },
        { "text": "False", "correct": false }
      ]
    }
  ]
}

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

  const renderElement = (element, index) => {
    if (element.type === "lesson") {
      return (
          <div key={index} className="card">
            {element.content.map((content, idx) => {
              if (content.type === "text-block") {
                return <p key={idx}>{content.text}</p>;
              } else if (content.type === "code-block") {
                return (
                    <pre key={idx}>
                  <code>{content.envCode}</code>
                </pre>
                );
              }
              return null;
            })}
          </div>
      );
    } else if (element.type === "question") {
      return (
          <div key={index} className="card">
            <p>{element.questionText}</p>
            {element.answers.map((answer, ansIndex) => (
                <div key={ansIndex}>
                  <input
                      type={element.questionType === "true-false" ? "radio" : "checkbox"}
                      name={`question-${index}`}
                      checked={answers[index] === ansIndex}
                      onChange={() => handleAnswerSelect(index, ansIndex)}
                  />
                  <label>{answer.text}</label>
                </div>
            ))}
          </div>
      );
    }
    return null;
  };

  return (
      <div>
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
