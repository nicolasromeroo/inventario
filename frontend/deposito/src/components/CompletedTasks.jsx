
import React from 'react';

const CompletedTasks = ({ tasks }) => {
    const handleCopy = () => {
        const text = tasks
            .filter((task) => task.completed)
            .map((task) => `- ${task.title}`)
            .join('\n');
        navigator.clipboard.writeText(`*TAREAS ${new Date().toLocaleDateString()}*\n${text}`);
    };

    return (
        <div>
            <button onClick={handleCopy}>Copiar Tareas Completadas</button>
        </div>
    );
};

export default CompletedTasks;
