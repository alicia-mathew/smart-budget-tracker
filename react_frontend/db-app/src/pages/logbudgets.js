import React, { useState } from 'react';
import './logbudgets.css'

function LogBudgets() {
    const [totalExpenditure, setTotalExpenditure] = useState(0);
    const [rows, setRows] = useState([{category : '', sliderValue : 0}]);

    const addRow = () => {
	setRows([...rows, {category : '', sliderValue : 0}]);
    };

    const handleCategoryChange = (index, value) => {
	const newRow = [...rows];
	newRow[index].category = value;
	setRows(newRow);
    };

    const handleSliderChange = (index, value) => {
	const newRow = [...rows];
	newRow[index].sliderValue = parseInt(value, 10);
	setRows(newRow);
    };

    const remainingExpenditure = totalExpenditure - rows.reduce((acc, row) => acc + row.sliderValue, 0);

    return (
	<div className="logbudgets">
	    <h2>What is the amount you want to allocate for expenditures this month?</h2>
	    <div className="">
		<label>Total Expenditures </label>
		<input
		    type="number"
		    value={totalExpenditure}
		    onChange={(e) => setTotalExpenditure(e.target.value)}
		/>
	    </div>
	    <div className="budget-table">
		<div className="table-row">
		    <div className="table-header">Categories</div>
		    <div className="table-header">Slider</div>
		    <div className="table-header">Budget</div>
		</div>
		{rows.map((row, index) => (
		  <div className="table-row" key={index}>
		    <input
		      type="text"
		      value={row.category}
		      onChange={(e) => handleCategoryChange(index, e.target.value)}
		      placeholder="Category Name"
		    />
		    <input
		      type="range"
		      min="0"
		      max={remainingExpenditure + row.sliderValue}
		      value={row.sliderValue}
		      onChange={(e) => handleSliderChange(index, e.target.value)}
		    />
		    <span>{row.sliderValue}</span>
		  </div>
		))}
		<div className="table-row">
		  <button onClick={addRow}>+</button>
		</div>
	    </div>
	</div>
    );
}

export default LogBudgets;
