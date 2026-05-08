import React from 'react';

const ConditionChecklist = ({ category, selectedChecks, setSelectedChecks }) => {
  const criteriaMap = {
    'Cards': ['Centered', 'No Whitening on Edges', 'Sharp Corners', 'Surface Scratch-Free'],
    'Coins': ['Uncirculated', 'No Scratches', 'Original Luster', 'Clear Date/Mint Mark'],
    'Books': ['No Torn Pages', 'Binding Intact', 'No Spine Stress', 'Cover pristine'],
    'Board Games': ['All Pieces Included', 'Box Unscratched', 'Instructions Included', 'No Board Warping'],
    'Plants': ['Pest-free', 'Healthy Roots', 'No Yellow Leaves', 'Actively Growing'],
    'Others': ['Clean', 'Fully Functional', 'No Major Damage']
  };

  const currentCriteria = criteriaMap[category] || criteriaMap['Others'];

  const handleCheckboxChange = (criterion) => {
    if (selectedChecks.includes(criterion)) {
      setSelectedChecks(selectedChecks.filter((item) => item !== criterion));
    } else {
      setSelectedChecks([...selectedChecks, criterion]);
    }
  };

  if (!category) return null;

  return (
    <div className="mt-2 p-4 rounded-4 border bg-light">
      <h4 className="h6 fw-semibold mb-3 text-secondary">Condition checklist · {category}</h4>
      <div className="row g-2">
        {currentCriteria.map((criterion, index) => (
          <div key={index} className="col-md-6">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`check-${category}-${index}`}
                checked={selectedChecks.includes(criterion)}
                onChange={() => handleCheckboxChange(criterion)}
              />
              <label className="form-check-label small" htmlFor={`check-${category}-${index}`}>
                {criterion}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionChecklist;
