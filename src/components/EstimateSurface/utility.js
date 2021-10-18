import { getAllLeafNodes } from './index';

export const getDataFromHash = (obj, args) => {
  return args.reduce((obj, level) => obj && obj[level], obj);
};

export const getHierarchy = (
  estimateSurface,
  parentSurfaceId,
  hierarchy = []
) => {
  for (let c1 = 0; c1 < estimateSurface.length; c1++) {
    const surface = estimateSurface[c1];
    if (surface.id == parentSurfaceId) {
      hierarchy.push(surface.name);
      return { status: true, hierarchy: hierarchy };
    }
    if (surface.surfaces && surface.surfaces.length > 0) {
      const res = getHierarchy(surface.surfaces, parentSurfaceId, hierarchy);
      if (res.status == true) {
        hierarchy.push(surface.name);
        return { status: true, hierarchy: hierarchy };
      }
    }
  }
  return { status: false };
};

export const getCheckboxState = (
  appState,
  surface,
  selected,
  roomParentId,
  roomId,
  parentSurfaceId,
  surfaceId
) => {
  // checking scenario for leave nodes
  if (surface.surfaces && surface.surfaces.length < 1 && surface.parent_id) {
    if (
      getDataFromHash(appState, [
        roomParentId,
        'bedrooms',
        roomId,
        'surfaces',
        parentSurfaceId,
        'surfaces',
        surfaceId,
        selected,
      ])
    )
      return 'checked';
    else return 'unchecked';
  }

  //Checking parentNode scenerio which exist in context associated with any child or not
  if (
    getDataFromHash(appState, [
      roomParentId,
      'bedrooms',
      roomId,
      'surfaces',
      surface.id,
    ])
  ) {
    if (
      getDataFromHash(appState, [
        roomParentId,
        'bedrooms',
        roomId,
        'surfaces',
        surface.id,
        selected,
      ])
    )
      return 'checked';
    else if (
      getDataFromHash(appState, [
        roomParentId,
        'bedrooms',
        roomId,
        'surfaces',
        surface.id,
        selected + 'Intermediate',
      ])
    )
      return 'intermediate';
    else return 'unchecked';
  }

  //Checking for those node which do not exist in context because of exisiting in most upper heirarchy
  const leafNodeSurfacesArr = getAllLeafNodes(surface);
  let count = 0;
  leafNodeSurfacesArr.map((s) => {
    if (
      getDataFromHash(appState, [
        roomParentId,
        'bedrooms',
        roomId,
        'surfaces',
        s['parentSurface'].id,
        'surfaces',
        s.newSurface.id,
        selected,
      ])
    ) {
      count++;
    }
  });

  if (count === 0) return 'unchecked';
  else if (count === leafNodeSurfacesArr.length) return 'checked';
  else return 'intermediate';
};

export const getSurfaceSwitchStatus = (
  appState,
  showInclusion,
  surfaceCategroy
) => {
  const count = { trueOnes: 0, falseOnes: 0 };
  Object.keys(appState).map((Pkey) => {
    return Object.keys(appState[Pkey]['bedrooms']).map((key, index) => {
      if (
        !(
          appState[Pkey]['bedrooms'][key]['included'] &&
          appState[Pkey]['bedrooms'][key]['selected']
        )
      )
        return;
      if (surfaceCategroy.surfaces.length < 1) {
        surfaceCategroy.parent_id
          ? getDataFromHash(appState, [
              Pkey,
              'bedrooms',
              key,
              'surfaces',
              surfaceCategroy.parent_id,
              'surfaces',
              surfaceCategroy.id,
              showInclusion ? 'included' : 'excluded',
            ])
            ? count.trueOnes++
            : count.falseOnes++
          : getDataFromHash(appState, [
              Pkey,
              'bedrooms',
              key,
              'surfaces',
              surfaceCategroy.id,
              showInclusion ? 'included' : 'excluded',
            ])
          ? count.trueOnes++
          : count.falseOnes++;
        return;
      }
      const leafNodes = getAllLeafNodes(surfaceCategroy).filter(
        (l) => l['newSurface']['selected']
      );

      const selectedIncludedNodes = leafNodes.filter((n) => {
        if (n['newSurface']['parent_id']) {
          if (
            getDataFromHash(appState, [
              Pkey,
              'bedrooms',
              key,
              'surfaces',
              n['newSurface'].parent_id,
              'surfaces',
              n['newSurface'].id,
              'selected',
            ]) &&
            getDataFromHash(appState, [
              Pkey,
              'bedrooms',
              key,
              'surfaces',
              n['newSurface'].parent_id,
              'surfaces',
              n['newSurface'].id,
              showInclusion ? 'included' : 'excluded',
            ])
          )
            return true;
        } else {
          if (
            getDataFromHash(appState, [
              Pkey,
              'bedrooms',
              key,
              'surfaces',

              n['newSurface'].id,
              'selected',
            ]) &&
            getDataFromHash(appState, [
              Pkey,
              'bedrooms',
              key,
              'surfaces',
              n['newSurface'].id,
              showInclusion ? 'included' : 'excluded',
            ])
          )
            return true;
        }
      });
      selectedIncludedNodes.length === leafNodes.length
        ? count.trueOnes++
        : count.falseOnes++;
    });
  });
  if (count.trueOnes !== 0 && count.falseOnes === 0) return true;
  return false;
};

export const getRoomSwitchStatus = (
  appState,
  allSelectedLeafNodes,
  showInclusion,
  roomParentId,
  roomId
) => {
  const output = allSelectedLeafNodes.filter((n) => {
    if (n['newSurface']['parent_id']) {
      if (
        getDataFromHash(appState, [
          roomParentId,
          'bedrooms',
          roomId,
          'surfaces',
          n['newSurface'].parent_id,
          'surfaces',
          n['newSurface'].id,
          'selected',
        ]) &&
        getDataFromHash(appState, [
          roomParentId,
          'bedrooms',
          roomId,
          'surfaces',
          n['newSurface'].parent_id,
          'surfaces',
          n['newSurface'].id,
          showInclusion ? 'included' : 'excluded',
        ])
      )
        return true;
    } else {
      if (
        getDataFromHash(appState, [
          roomParentId,
          'bedrooms',
          roomId,
          'surfaces',

          n['newSurface'].id,
          'selected',
        ]) &&
        getDataFromHash(appState, [
          roomParentId,
          'bedrooms',
          roomId,
          'surfaces',
          n['newSurface'].id,
          showInclusion ? 'included' : 'excluded',
        ])
      )
        return true;
    }
  });
  if (output.length === allSelectedLeafNodes.length) return true;
  return false;
};

export const getAllAncesstorIds = (
  estimateSurface,
  parentSurfaceId,
  hierarchy = []
) => {
  for (let c1 = 0; c1 < estimateSurface.length; c1++) {
    const surface = estimateSurface[c1];
    if (surface.id == parentSurfaceId) {
      hierarchy.push(surface.id);
      return { status: true, hierarchy: hierarchy };
    }
    if (surface.surfaces && surface.surfaces.length > 0) {
      const res = getAllAncesstorIds(
        surface.surfaces,
        parentSurfaceId,
        hierarchy
      );
      if (res.status == true) {
        hierarchy.push(surface.id);
        return { status: true, hierarchy: hierarchy };
      }
    }
  }
  return { status: false };
};

export const countIncluded = (appState) => {
  let output = 0;
  Object.keys(appState).map((pKey) => {
    Object.keys(appState[pKey]['bedrooms']).map((key, index) => {
      appState[pKey]['bedrooms'][key]['included'] &&
        appState[pKey]['bedrooms'][key]['selected'] &&
        output++;
    });
  });
  return output;
};
