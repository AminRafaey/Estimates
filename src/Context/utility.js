export function updateParentState(stateClone, category_Id) {
  let includedTrueOnes = 0;
  let excludedTrueOnes = 0;
  const total = Object.keys(stateClone[category_Id]['bedrooms']).filter(
    (roomId) => stateClone[category_Id]['bedrooms'][roomId]['selected']
  ).length;
  Object.keys(stateClone[category_Id]['bedrooms']).map((key) => {
    if (stateClone[category_Id]['bedrooms'][key]['selected']) {
      stateClone[category_Id]['bedrooms'][key]['included'] &&
        includedTrueOnes++;
      stateClone[category_Id]['bedrooms'][key]['excluded'] &&
        excludedTrueOnes++;
    }
  });

  if (includedTrueOnes > 0 && includedTrueOnes < total) {
    stateClone[category_Id][`includedIntermediate`] = true;
    stateClone[category_Id][`included`] = false;
  }
  if (includedTrueOnes === 0) {
    stateClone[category_Id][`includedIntermediate`] = false;
    stateClone[category_Id][`included`] = false;
  }
  if (excludedTrueOnes > 0 && excludedTrueOnes < total) {
    stateClone[category_Id][`excludedIntermediate`] = true;
    stateClone[category_Id][`excluded`] = false;
  }
  if (excludedTrueOnes === 0) {
    stateClone[category_Id][`excludedIntermediate`] = false;
    stateClone[category_Id][`excluded`] = false;
  }
  if (includedTrueOnes === total && includedTrueOnes !== 0) {
    stateClone[category_Id][`included`] = true;
    stateClone[category_Id][`includedIntermediate`] = false;
  }
  if (excludedTrueOnes === total && excludedTrueOnes !== 0) {
    stateClone[category_Id][`excluded`] = true;
    stateClone[category_Id][`excludedIntermediate`] = false;
  }
  return stateClone;
}
