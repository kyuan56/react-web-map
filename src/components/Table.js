import React, { useState } from 'react';

const Table = ({ markedLocations,setMarkedLocations,handleDeleteSelected,selectedRows, setSelectedRows }) => {
  const [currentPage, setCurrentPage] = useState(1);
 

  const pageSize = 10;
  const pageCount = Math.ceil(markedLocations.length / pageSize);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCheckboxChange = (event, index) => {
    if (event.target.checked) {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, index]);
    } else {
      setSelectedRows((prevSelectedRows) => prevSelectedRows.filter((rowIndex) => rowIndex !== index));
    }
  };

  

  const renderTableRows = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, markedLocations.length);

    return markedLocations.slice(startIndex, endIndex).map((location, index) => {
      const rowNumber = startIndex + index;
      return (
        <tr key={rowNumber}>
          <td>
            <input type="checkbox" onChange={(event) => handleCheckboxChange(event, rowNumber)} />
          </td>
          <td>{location.formatted_address}</td>
        </tr>
      );
    });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    for (let i = 1; i <= pageCount; i++) {
      buttons.push(
        <button key={i} onClick={() => handlePageChange(i)}>
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>{renderTableRows()}</tbody>
      </table>
      <div>
        <button onClick={handleDeleteSelected}>Delete Selected</button>
      </div>
      <div>
        <span>Page:</span>
        {renderPaginationButtons()}
      </div>
    </div>
  );
};

export default Table;
