import React, { useEffect, useState } from 'react';
import SurfaceMapping from './SurfaceMapping';
import {
  useSurfaceSelectionState,
  useSurfaceSelectionDispatch,
  loadSurfaceContext,
} from '../../Context/SurfaceSelectionContext';
import { useSessionDispatch, useSessionState } from '../../Context/Session';
import { getSurfaces } from '../../api/estimateSurface';
import { styled, Box, CircularProgress } from '@material-ui/core';
import { Alert as MuiAlert } from '@material-ui/lab';
import AddDropUp from './AddDropUp';
const LoadingWrapper = styled(Box)({
  minHeight: window.innerHeight - 270,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Alert = styled(MuiAlert)({
  margin: '50px auto auto',
  maxWidth: 800,
});

function EstimateSurface() {
  const surfaceSelectionDispatch = useSurfaceSelectionDispatch();
  const estimateSurface = useSurfaceSelectionState();
  const sessionDispatch = useSessionDispatch();
  const sessionState = useSessionState();
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    if (Object.entries(estimateSurface).length < 1) {
      getSurfaces(sessionDispatch).then((res) => {
        loadSurfaceContext(surfaceSelectionDispatch, { surfaces: res });
        setLoader(false);
      });
    } else {
      setLoader(false);
    }
  }, [sessionState.expired]);
  if (loader) {
    return (
      <LoadingWrapper>
        <CircularProgress color="primary" />
      </LoadingWrapper>
    );
  }
  if (Object.entries(estimateSurface).length < 1) {
    return <Alert severity="warning">No Surface is available to show...</Alert>;
  }

  return (
    <div>
      <SurfaceMapping />
      <AddDropUp />
    </div>
  );
}

export function getUpdatedSurfaces(
  targetName,
  targetValue,
  surfaceId,
  surfaces,
  position,
  parentId = null
) {
  for (let c1 = 0; c1 < surfaces.length; c1++) {
    let surface = surfaces[c1];
    if (surface.id === surfaceId) {
      if (
        targetName !== 'name' &&
        surface.surfaces &&
        surface.surfaces.length > 0
      ) {
        let checkAllChild;
        !targetValue &&
          (checkAllChild = checkedAndUncheckedAll(
            surface.surfaces,
            targetValue
          ));
        {
          return {
            status: true,
            obj: surfaces.map((s) =>
              s.id === surfaceId
                ? {
                    ...surface,
                    surfaces: targetValue ? surface.surfaces : checkAllChild,
                    indeterminate: false,
                    ['selected']: targetValue,
                    ...(position >= 0 && { position: position }),
                  }
                : s
            ),
            parentId: parentId,
          };
        }
      }
      return {
        status: true,
        obj: surfaces.map((s) =>
          s.id === surfaceId
            ? {
                ...surface,
                ...(targetName !== 'name' && {
                  indeterminate: false,
                  ['selected']: targetValue,
                }),
                ...(targetName === 'name' && {
                  ['name']: targetValue ? targetValue : '',
                }),
                ...(position >= 0 && { position: position }),
              }
            : s
        ),
        parentId: parentId,
      };
    }
    if (surface.surfaces && surface.surfaces.length > 0) {
      const res = getUpdatedSurfaces(
        targetName,
        targetValue,
        surfaceId,
        surface.surfaces,
        position,
        surface.id
      );
      if (res.status) {
        let updatedSurfaceObj = surfaces.map((s) =>
          s.id === res.parentId ? { ...surface, surfaces: res.obj } : s
        );
        let notUpdatedSurface = surfaces.find((s) => s.id === res.parentId);
        if (
          targetName !== 'name' &&
          notUpdatedSurface.surfaces &&
          notUpdatedSurface.surfaces.length > 0
        ) {
          let getCheckboxStatus = getRoomGroupState(res.obj);
          notUpdatedSurface = {
            ...notUpdatedSurface,
            ...(getCheckboxStatus === 'checked'
              ? { selected: true, indeterminate: false }
              : { selected: false, indeterminate: false }),
            ...(getCheckboxStatus === 'indeterminate' && {
              indeterminate: true,
            }),
            surfaces: res.obj,
          };
          updatedSurfaceObj = updatedSurfaceObj.map((s) =>
            s.id === res.parentId ? notUpdatedSurface : s
          );
        }
        return {
          status: true,
          obj: updatedSurfaceObj,
          parentId: parentId,
        };
      }
    }
  }
  return { status: false };
}

const checkedAndUncheckedAll = (surfaces, selected) => {
  let surfacesClone = [...surfaces];
  for (let c1 = 0; c1 < surfacesClone.length; c1++) {
    let surface = surfacesClone[c1];
    if (surface.surfaces && surface.surfaces.length > 0) {
      surfacesClone[c1] = {
        ...surface,
        indeterminate: false,
        surfaces: checkedAndUncheckedAll(surface.surfaces, selected),
      };
    }
  }
  return surfacesClone.map((t) => {
    return {
      ...t,
      ['selected']: selected,
    };
  });
};

const getRoomGroupState = (surface) => {
  let output = countTrueAndFalseOnes(surface);
  switch (true) {
    case output.trueOnes > 0 && output.falseOnes > 0:
      return 'indeterminate';
    default:
      return 'checked';
  }
};

export function countTrueAndFalseOnes(
  surface,
  output = {
    trueOnes: 0,
    falseOnes: 0,
  }
) {
  for (let c1 = 0; c1 < surface.length; c1++) {
    if (surface[c1]['selected'] && surface[c1]['selected'] === true) {
      output.trueOnes++;
    } else output.falseOnes++;
    if (surface[c1].surfaces && surface[c1].surfaces.length > 0) {
      countTrueAndFalseOnes(surface[c1].surfaces, output);
    }
  }
  return output;
}

export const getAllLeafNodes = (parentSurface, newSurfacesArr = []) => {
  for (let c1 = 0; c1 < parentSurface.surfaces.length; c1++) {
    const surface = parentSurface.surfaces[c1];
    if (surface.surfaces && surface.surfaces.length > 0) {
      getAllLeafNodes(surface, newSurfacesArr);
    }
  }
  for (let c1 = 0; c1 < parentSurface.surfaces.length; c1++) {
    const surface = parentSurface.surfaces[c1];
    if (surface.surfaces && surface.surfaces.length > 0) continue;
    const { id, name, parent_id, selected, surface_id } = surface;

    newSurfacesArr.push({
      ['parentSurface']: parentSurface,
      newSurface: {
        id,
        name,
        parent_id,
        selected,
        surface_id,
      },
    });
  }

  return newSurfacesArr;
};

export const countIncludedRooms = (appState) => {
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
export default EstimateSurface;
