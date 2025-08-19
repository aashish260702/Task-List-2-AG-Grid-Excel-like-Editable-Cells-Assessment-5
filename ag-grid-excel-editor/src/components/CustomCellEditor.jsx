import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const CustomCellEditor = forwardRef((props, ref) => {
    const [value, setValue] = useState(props.value || '');
    const inputRef = useRef();

    useImperativeHandle(ref, () => ({
        getValue: () => value,
        isCancelBeforeStart: () => false,
        isCancelAfterEnd: () => false,
    }));

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            props.stopEditing();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            props.stopEditing(true);
        }
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            border: '2px solid #4CAF50',
            backgroundColor: '#f9f9f9',
            padding: '2px',
            boxSizing: 'border-box'
        }}>
            <input
                ref={inputRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    width: 'calc(100% - 20px)',
                    fontSize: '14px',
                    padding: '2px'
                }}
            />
            <span style={{ color: '#4CAF50', fontSize: '12px', marginLeft: '4px', flexShrink: 0 }}>
                ✏️
            </span>
        </div>
    );
});

CustomCellEditor.displayName = 'CustomCellEditor';

export default CustomCellEditor;
