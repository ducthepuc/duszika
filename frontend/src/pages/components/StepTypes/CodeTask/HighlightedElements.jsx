import React from 'react';
import Editor from "@monaco-editor/react";

export function HighlightedElements({
                                        elements,
                                        onAdd,
                                        onRemove,
                                        onChange
                                    }) {
    return (
        <div>
            <h4>Example Code</h4>
            {elements.map((element, elementIndex) => (
                <div key={elementIndex} className="flex items-center mb-2">
                    <Editor
                        defaultLanguage="python"
                        width="100%"
                        height="250px"
                        onChange={(e) => onChange(elementIndex, e.target.value)}
                        options={{
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            contextmenu: true
                        }}
                        value={element}
                        theme="vs-dark"
                    />
                    <button
                        onClick={() => onRemove(elementIndex)}
                        className="text-red-500 hover:text-red-700"
                    >
                        X
                    </button>
                </div>
            ))}
            <button
                onClick={onAdd}
                className="px-4 py-2 mb-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
                Add Example Code
            </button>
        </div>
    );
}