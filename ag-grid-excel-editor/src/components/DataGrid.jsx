import React, { useState, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { themeQuartz } from 'ag-grid-community';
import CustomCellEditor from './CustomCellEditor';
import FormulaBar from './FormulaBar';

import '../styles/grid.css';

const DataGrid = ({ data }) => {
    const [rowData, setRowData] = useState(data);
    const [selectedCell, setSelectedCell] = useState(null);
    const [formulaBarValue, setFormulaBarValue] = useState('');
    const [gridApi, setGridApi] = useState(null);

    const columnDefs = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            cellClass: 'ag-cell-center'
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            sortable: true,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 200,
            sortable: true,
            filter: 'agTextColumnFilter'
        },
        {
            field: 'value',
            headerName: 'Editable Value',
            width: 300,
            editable: true,
            cellEditor: 'customCellEditor',
            singleClickEdit: true,
            sortable: true,
            filter: 'agTextColumnFilter',
            cellClass: 'editable-cell'
        },
    ];

    const defaultColDef = {
        resizable: true,
        sortable: false,
        filter: false,
        flex: 1,
        minWidth: 100,
    };

    const rowSelection = {
        mode: 'singleRow',
        enableClickSelection: true,
        checkboxes: false,
        headerCheckbox: false
    };

    const cellSelection = {
        handle: {
            mode: 'range'
        }
    };

    const onGridReady = useCallback((params) => {
        setGridApi(params.api);

        params.api.sizeColumnsToFit();

        console.log('Grid is ready with', data?.length || 0, 'rows');
    }, [data]);

    const handleCellClicked = useCallback((event) => {
        const { rowIndex, column, value, data: rowData } = event;

        console.log('Cell clicked:', {
            row: rowIndex,
            column: column.colId,
            value: value
        });

        const cellInfo = {
            row: rowIndex,
            column: column.colId,
            field: column.colId,
            rowData: rowData
        };

        setSelectedCell(cellInfo);
        setFormulaBarValue(value !== null && value !== undefined ? String(value) : '');
    }, []);

    const handleCellEditingStarted = useCallback((event) => {
        const { rowIndex, column, value } = event;
        console.log('Cell editing started:', { row: rowIndex, column: column.colId, value });

        const cellInfo = {
            row: rowIndex,
            column: column.colId,
            field: column.colId
        };

        setSelectedCell(cellInfo);
        setFormulaBarValue(value !== null && value !== undefined ? String(value) : '');
    }, []);

    const handleCellEditingStopped = useCallback((event) => {
        const { rowIndex, column, newValue, oldValue } = event;
        console.log('Cell editing stopped:', {
            row: rowIndex,
            column: column.colId,
            oldValue,
            newValue
        });

        if (selectedCell && selectedCell.row === rowIndex && selectedCell.field === column.colId) {
            setFormulaBarValue(newValue !== null && newValue !== undefined ? String(newValue) : '');
        }

        setRowData(prevData => {
            const newData = [...prevData];
            if (newData[rowIndex]) {
                newData[rowIndex] = { ...newData[rowIndex], [column.colId]: newValue };
            }
            return newData;
        });
    }, [selectedCell]);

    const handleRowDataUpdated = useCallback(() => {
        if (gridApi) {
            gridApi.sizeColumnsToFit();
        }
    }, [gridApi]);

    const handleFormulaBarChange = useCallback((newValue) => {
        setFormulaBarValue(newValue);

        if (selectedCell && gridApi) {
            try {
                const rowNode = gridApi.getRowNode(selectedCell.row);
                if (rowNode && rowNode.data) {
                    const updatedData = { ...rowNode.data };
                    updatedData[selectedCell.field] = newValue;

                    rowNode.setData(updatedData);

                    setRowData(prevData => {
                        const newData = [...prevData];
                        if (newData[selectedCell.row]) {
                            newData[selectedCell.row] = { ...newData[selectedCell.row], [selectedCell.field]: newValue };
                        }
                        return newData;
                    });
                }
            } catch (error) {
                console.error('Error updating cell from formula bar:', error);
            }
        }
    }, [selectedCell, gridApi]);

    const handleFormulaBarSave = useCallback(() => {
        console.log('Formula bar save clicked');
        if (gridApi) {
            gridApi.stopEditing();

            gridApi.refreshCells({
                force: true,
                suppressFlash: true
            });
        }
    }, [gridApi]);

    const handleFormulaBarCancel = useCallback(() => {
        console.log('Formula bar cancel clicked');
        if (selectedCell && gridApi) {
            gridApi.stopEditing(true);

            const rowNode = gridApi.getRowNode(selectedCell.row);
            if (rowNode && rowNode.data) {
                const originalValue = rowNode.data[selectedCell.field];
                setFormulaBarValue(originalValue !== null && originalValue !== undefined ? String(originalValue) : '');
            }
        }
    }, [selectedCell, gridApi]);

    console.log('DataGrid received data:', data);
    console.log('Current rowData state:', rowData);
    console.log('Selected cell:', selectedCell);

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <FormulaBar
                selectedCell={selectedCell}
                value={formulaBarValue}
                onValueChange={handleFormulaBarChange}
                onSave={handleFormulaBarSave}
                onCancel={handleFormulaBarCancel}
            />

            <div
                style={{
                    height: '550px',
                    width: '100%',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }}
            >
                <AgGridReact
                    theme={themeQuartz}

                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}

                    onGridReady={onGridReady}
                    onCellClicked={handleCellClicked}
                    onCellEditingStarted={handleCellEditingStarted}
                    onCellEditingStopped={handleCellEditingStopped}
                    onRowDataUpdated={handleRowDataUpdated} 

                    rowSelection={rowSelection}
                    cellSelection={cellSelection}

                    editType="fullRow"
                    stopEditingWhenCellsLoseFocus={true}
                    enterNavigatesVertically={true}
                    enterNavigatesVerticallyAfterEdit={true}
                    singleClickEdit={false} 

                    components={{
                        customCellEditor: CustomCellEditor,
                    }}

                    animateRows={true}
                    suppressColumnVirtualisation={false}
                    suppressRowVirtualisation={false}

                    suppressMenuHide={false}
                    suppressMovableColumns={false}

                    debug={false}
                />
            </div>

            {process.env.NODE_ENV === 'development' && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                    fontSize: '12px',
                    borderRadius: '4px'
                }}>
                    <strong>Debug Info:</strong><br />
                    Rows: {rowData?.length || 0} |
                    Selected: {selectedCell ? `Row ${selectedCell.row + 1}, Col ${selectedCell.column}` : 'None'} |
                    Formula Bar: "{formulaBarValue}"
                </div>
            )}
        </div>
    );
};

export default DataGrid;
