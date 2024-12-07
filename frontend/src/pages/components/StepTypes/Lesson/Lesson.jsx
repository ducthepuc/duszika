import React from 'react';
import { motion } from 'framer-motion';

export function Lesson({ step, stepIndex, steps, setSteps }) {
    return (
        <div>
            <h3>Lesson Content</h3>
            {step.content.map((contentItem, contentIndex) => (
                <div key={contentIndex} className="mb-2">
          <motion.textarea
              placeholder="Lesson Text"
              value={contentItem.text}
              onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[stepIndex].content[contentIndex].text = e.target.value;
                  setSteps(newSteps);
              }}
              style={{
                  width: '75%',
                  height: '250px',
                  padding: '12px',
                  marginBottom: '16px',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  backgroundColor: '#333333',
                  color: 'white',
                  outline: 'none',
                  resize: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  fontSize: '16px',
              }}
              whileHover={{
                  backgroundColor: '#444444',
              }}
              whileFocus={{
                  backgroundColor: '#555555',
                  border: '1px solid #FF7F4F',
              }}
          />
                </div>
            ))}
        </div>
    );
}