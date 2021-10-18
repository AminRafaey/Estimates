import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import useInterval from './Interval';
import AuthenticationForm from './AuthenticationForm';
import config from '../../config.json';
import { useSessionState, useSessionDispatch } from '../../Context/Session';
import {
  useAppState,
  useAppDispatch,
  loadRoomsInAppContext,
  insertFields,
} from '../../Context/AppContext';
import {
  useRoomsState,
  useRoomsDispatch,
  replaceContextWithUpdatedOne,
  insertIds,
} from '../../Context/RoomSelectionContext';
import {
  saveEstimate,
  getEstimate,
  createNewEstimate,
} from '../../api/estimate';
import { idsNotExistInPRContext } from '../EstimateMeasurement/utility';
import {
  useSurfaceProductionRatesState,
  useSurfaceProductionRatesDispatch,
  loadSurfaceProductionRatesContext,
} from '../../Context/SurfaceProductionRates';
import { getSurfaceProductionRates } from '../../api/estimateSurface';
import { saveRoomContext } from '../../api/estimateRoom';
import { getAllActionFromApp } from '../EstimateProduct/utility';
import { cloneState } from '../EstimateProduct/stateClone';
import { getProducts } from '../../api/estimateProduct';
import {
  useProductState,
  useProductDispatch,
  loadProducts,
} from '../../Context/ProductContext';

import {
  getFilteredRooms,
  insertUniqueIdsInRooms,
} from '../EstimateRoom/utility';
export default function SessionAuthentication(props) {
  const {
    setGlobalLoader,
    setSavedChangesStatus,
    savedChangesStatus,
    setSaveEstimateLoader,
    saveEstimateLoader,
    setLeadName,
  } = props;
  const search = useLocation().search;
  const location = useLocation();
  const currentPath = location.pathname.replace('/estimates/', '');

  const estimate_id = new URLSearchParams(search).get('estimate_id');
  const newEstimate = new URLSearchParams(search).get('newEstimate');
  const job_id = new URLSearchParams(search).get('job_id');
  const sessionState = useSessionState();
  const sessionDispatch = useSessionDispatch();
  const appState = useAppState();
  const appDispatch = useAppDispatch();
  const estimateRooms = useRoomsState();
  const estimateRoomsDispatch = useRoomsDispatch();
  const savedEstimate = useRef(JSON.stringify(appState));
  const savedRooms = useRef(JSON.stringify(estimateRooms));
  const surfaceProductionRatesState = useSurfaceProductionRatesState();
  const SurfaceProductionRatesDispatch = useSurfaceProductionRatesDispatch();
  const productState = useProductState();
  const productDispatch = useProductDispatch();
  useEffect(() => {
    if (saveEstimateLoader) {
      if (currentPath === 'rooms') {
        const filteredRooms = getFilteredRooms(estimateRooms);
        JSON.stringify(filteredRooms) === savedRooms.current &&
          setSaveEstimateLoader(false);

        JSON.stringify(filteredRooms) === savedRooms.current &&
          savedChangesStatus === 'Unsaved Changes' &&
          setSavedChangesStatus('All changes saved');

        if (
          JSON.stringify(filteredRooms) !== savedRooms.current &&
          Object.entries(filteredRooms).length > 0
        ) {
          const updatedRoomContext = insertUniqueIdsInRooms(estimateRooms);
          const updatedFilteredRoomContext = getFilteredRooms(
            updatedRoomContext
          );
          replaceContextWithUpdatedOne(estimateRoomsDispatch, {
            updatedContext: updatedRoomContext,
          });
          saveRoomContext(sessionDispatch, updatedFilteredRoomContext).then(
            (res) => {
              insertIds(estimateRoomsDispatch, {
                updatedContext: res,
              });
              setSaveEstimateLoader(false);
              setSavedChangesStatus('All changes saved');
            }
          );
        }
        Object.entries(filteredRooms).length > 0 &&
          (savedRooms.current = JSON.stringify(filteredRooms));
      } else {
        JSON.stringify(appState) === savedEstimate.current &&
          setSaveEstimateLoader(false);

        JSON.stringify(appState) === savedEstimate.current &&
          savedChangesStatus === 'Unsaved Changes' &&
          setSavedChangesStatus('All changes saved');

        JSON.stringify(appState) !== savedEstimate.current &&
          Object.entries(appState).length > 0 &&
          saveEstimate(sessionDispatch, appState, setSavedChangesStatus).then(
            (res) => {
              setSaveEstimateLoader(false);
            }
          );

        Object.entries(appState).length > 0 &&
          (savedEstimate.current = JSON.stringify(appState));
      }
    }
  }, [saveEstimateLoader]);

  useInterval(() => {
    if (currentPath === 'rooms') {
      const filteredRooms = getFilteredRooms(estimateRooms);
      JSON.stringify(filteredRooms) === savedRooms.current &&
        savedChangesStatus === 'Unsaved Changes' &&
        setSavedChangesStatus('All changes saved');

      if (
        JSON.stringify(filteredRooms) !== savedRooms.current &&
        Object.entries(filteredRooms).length > 0
      ) {
        const updatedRoomContext = insertUniqueIdsInRooms(estimateRooms);
        const updatedFilteredRoomContext = getFilteredRooms(updatedRoomContext);
        replaceContextWithUpdatedOne(estimateRoomsDispatch, {
          updatedContext: updatedRoomContext,
        });
        saveRoomContext(sessionDispatch, updatedFilteredRoomContext).then(
          (res) => {
            insertIds(estimateRoomsDispatch, {
              updatedContext: res,
            });
            setSavedChangesStatus('All changes saved');
          }
        );
      }
      Object.entries(filteredRooms).length > 0 &&
        (savedRooms.current = JSON.stringify(filteredRooms));
    } else {
      JSON.stringify(appState) === savedEstimate.current &&
        savedChangesStatus === 'Unsaved Changes' &&
        setSavedChangesStatus('All changes saved');
      JSON.stringify(appState) !== savedEstimate.current &&
        Object.entries(appState).length > 0 &&
        saveEstimate(sessionDispatch, appState, setSavedChangesStatus);
      Object.entries(appState).length > 0 &&
        (savedEstimate.current = JSON.stringify(appState));
    }
  }, config.autoSaveEstimateInterval);

  useEffect(() => {
    if (estimate_id) {
      window.localStorage.setItem('ESTIMATE_ID', estimate_id);
    }
    if (window.localStorage.getItem('ESTIMATE_ID') && !newEstimate) {
      getEstimate(sessionDispatch).then((res) => {
        if (res) {
          loadRoomsInAppContext(appDispatch, { rooms: res.estimate });
          res.contact &&
            setLeadName(`${res.contact.first_name} ${res.contact.last_name}`);
          const requests = [];
          const ids = idsNotExistInPRContext(
            res.estimate,
            Object.keys(surfaceProductionRatesState)
          );
          if (ids.length > 0) {
            requests.push(
              getSurfaceProductionRates(sessionDispatch, ids)
                .then((prRes) => {
                  if (prRes && prRes.data) {
                    return prRes.data;
                  }
                  return {};
                })
                .then((prRes) => {
                  loadSurfaceProductionRatesContext(
                    SurfaceProductionRatesDispatch,
                    {
                      surfaceProductionRates: prRes,
                    }
                  );
                  insertFields(appDispatch, {
                    surfaceProductionRates: prRes,
                  });
                })
            );
          }
          const allUniqueIncludedActions = getAllActionFromApp(
            cloneState(res.estimate)
          );
          if (allUniqueIncludedActions.find((a) => !productState[a.actionId])) {
            requests.push(
              getProducts(sessionDispatch).then((pRes) =>
                loadProducts(productDispatch, { products: pRes })
              )
            );
          }
          Promise.allSettled(requests).then((resArr) => setGlobalLoader(false));
        } else {
          createNewEstimate(sessionDispatch).then((res) => {
            res &&
              setLeadName(`${res.contact.first_name} ${res.contact.last_name}`);
            res && setGlobalLoader(false);
          });
        }
      });
    } else {
      createNewEstimate(sessionDispatch, job_id).then((res) => {
        res.contact &&
          setLeadName(`${res.contact.first_name} ${res.contact.last_name}`);
        res && setGlobalLoader(false);
      });
    }
  }, [sessionState.expired]);

  return <AuthenticationForm />;
}
