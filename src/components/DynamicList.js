import React from 'react';

function formatColumnName(column) {
    // Split the column name by underscores and capitalize each word
    return column
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function DynamicList({ data, columns, onRemove = false,  onUpdate = false, onCancel = false }) {
    return (
        <table>
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column}>{formatColumnName(column)}</th>
                ))}
                {onUpdate && <th key="Update">Update</th>}
                {onRemove && <th key="Remove">Remove</th>}
                {onCancel && <th key="Cancel">Cancel</th>}
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index}>
                    {columns.map((column) => (
                        <td key={column}>
                            {/* Check the data type and convert if needed */}
                            {typeof item[column] === 'number'
                                ? item[column].toString() // Convert to string if it's a number
                                : item[column]}
                        </td>
                    ))}
                    {onUpdate && (
                        <td>
                            <button onClick={() => onUpdate(index)}>Update</button>
                        </td>
                    )}
                    {onRemove && (
                        <td>
                            <button onClick={() => onRemove(index)}>Remove</button>
                        </td>
                    )}
                    {onCancel && (
                        <td>
                            <button onClick={() => onCancel(item)}>Cancel</button>
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

export default DynamicList;
