import React from 'react';

const FormulaBar = ({ selectedCell, value, onValueChange, onSave, onCancel }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSave && onSave();
        }
        if (e.key === 'Escape') {
            onCancel && onCancel();
        }
    };

    return (
        <div className="formula-bar-container">
            <button
                className="formula-bar-action-btn"
                onClick={onSave}
                title="Save"
                disabled={!selectedCell}
            >
                ✓
            </button>
            <button
                className="formula-bar-action-btn"
                onClick={onCancel}
                title="Cancel"
                disabled={!selectedCell}
            >
                ✗
            </button>
            <span className="formula-bar-icon" title="Function">fx</span>
            <input
                className="formula-bar-input"
                type="text"
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedCell ? `Edit cell ${selectedCell.column}${selectedCell.row + 1}` : 'Select a cell...'}
                disabled={!selectedCell}
            />
        </div>
    );
};

export default FormulaBar;
