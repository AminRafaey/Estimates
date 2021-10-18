import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { EstimateHeader } from './components';
import { EstimateRoom } from './components';
import { EstimateSurface } from './components';
import { EstimateProduct } from './components';
import { EstimateSummary } from './components';
import { EstimateLink } from './components';
import { RoomsProvider } from './Context/RoomSelectionContext';
import { SurfaceSelectionProvider } from './Context/SurfaceSelectionContext';
import { LinkingProvider } from './Context/LinkingContext';
import { AppProvider } from './Context/AppContext';
import { ThemeProvider } from '@material-ui/styles';
import { theme } from './theme';
import { EstimateMeasurement, ImageUpload } from './components';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import MultiBackend, { TouchTransition } from 'react-dnd-multi-backend';
import Preview from 'react-dnd-preview';
import RoomMobileDragPreview from './components/EstimateRoom/RoomMobileDragPreview';
import { SurfaceProductionRatesProvider } from './Context/SurfaceProductionRates';
import { ProductProvider } from './Context/ProductContext';
import SessionAuthentication from './components/SessionAuthentication';
import { SessionProvider } from './Context/Session';
import CustomizedRoute from './components/CustomizedRoute';
import { ColorProvider } from './Context/Color';
import { useWidth } from './components/Assets';
import SimpleAuthentication from './components/SessionAuthentication/SimpleAuthentication';
import { ReportProvider } from './Context/Report';

const CustomHTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      preview: true,
    },
    {
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      transition: TouchTransition,
    },
  ],
};

const generatePreview = ({ itemType, item, style }) => {
  return (
    <div className="item-list__item" style={style}>
      <RoomMobileDragPreview
        roomCategory_Id={item.roomCategory_Id}
        name={item.name}
      />
    </div>
  );
};

function App() {
  const width = useWidth();
  const [globalLoader, setGlobalLoader] = useState(true);
  const [savedChangesStatus, setSavedChangesStatus] = useState(
    'All changes saved'
  );
  const savedChangesStatusRef = useRef(savedChangesStatus);
  const [saveEstimateLoader, setSaveEstimateLoader] = useState(false);
  const [leadName, setLeadName] = useState('-');
  const [hourlyRate, setHourlyRate] = useState(
    window.localStorage.getItem('hourlyRate')
  );
  const pageWrapper = {
    padding: '170px 0px 70px 70px',
    background: '#e9eef5',
    minHeight: '100vh',
    overflowX: 'auto',
  };
  const productPageWrapper = {
    padding: '170px 30px 70px',
    background: '#e9eef5',
    minHeight: '100vh',
    overflow: 'scroll',
  };
  const mappingPageWrapper = {
    paddingTop: 170,
    background: '#e9eef5',
    minHeight: '115vh',
  };

  const linkingPageWrapper = {
    paddingTop: 70,
    background: '#e9eef5',
    minHeight: '100vh',
  };
  const measurementPageWrapper = {
    padding: '150px 30px 70px',
    background: '#e9eef5',
    minHeight: '100vh',
  };

  const summaryPageWrapper = {
    background: '#e9eef5',
    paddingTop: '74px',
    minHeight: '100vh',
  };

  const imageUploadPageWrapper = {
    background: '#e9eef5',
    minHeight: '100vh',
  };
  useEffect(() => {
    savedChangesStatusRef.current = savedChangesStatus;
  }, [savedChangesStatus]);

  useEffect(() => {
    window.addEventListener('beforeunload', function (e) {
      if (savedChangesStatusRef.current !== 'All changes saved') {
        setSaveEstimateLoader(true);
        var confirmationMessage = 'o/';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
      return undefined;
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route
            path="/estimates"
            render={({ match: { url } }) => (
              <>
                <SessionProvider>
                  <RoomsProvider>
                    <SurfaceSelectionProvider>
                      <AppProvider>
                        <LinkingProvider>
                          <SurfaceProductionRatesProvider>
                            <ProductProvider>
                              <SessionAuthentication
                                setGlobalLoader={setGlobalLoader}
                                setSavedChangesStatus={setSavedChangesStatus}
                                savedChangesStatus={savedChangesStatus}
                                setSaveEstimateLoader={setSaveEstimateLoader}
                                saveEstimateLoader={saveEstimateLoader}
                                setLeadName={setLeadName}
                              />
                              <EstimateHeader
                                savedChangesStatus={savedChangesStatus}
                                setSavedChangesStatus={setSavedChangesStatus}
                                globalLoader={globalLoader}
                                setSaveEstimateLoader={setSaveEstimateLoader}
                                saveEstimateLoader={saveEstimateLoader}
                                leadName={leadName}
                                hourlyRate={hourlyRate}
                              />
                              <ColorProvider>
                                <ReportProvider>
                                  <Switch>
                                    <CustomizedRoute
                                      globalLoader={globalLoader}
                                      path={`${url}/rooms`}
                                      exact={true}
                                    >
                                      <div style={pageWrapper}>
                                        <DndProvider
                                          backend={MultiBackend}
                                          options={CustomHTML5toTouch}
                                        >
                                          <EstimateRoom />
                                          {(width === 'xs' ||
                                            width === 'sm') && (
                                            <Preview
                                              generator={generatePreview}
                                            />
                                          )}
                                        </DndProvider>
                                      </div>
                                    </CustomizedRoute>
                                    <CustomizedRoute
                                      globalLoader={globalLoader}
                                      path={`${url}/surfaces`}
                                      exact={true}
                                    >
                                      <div style={mappingPageWrapper}>
                                        <EstimateSurface />
                                      </div>
                                    </CustomizedRoute>
                                    <CustomizedRoute
                                      globalLoader={globalLoader}
                                      path={`${url}/products`}
                                      exact={true}
                                    >
                                      <div
                                        style={productPageWrapper}
                                        className="scrollElement"
                                      >
                                        <EstimateProduct />
                                      </div>
                                    </CustomizedRoute>

                                    <CustomizedRoute
                                      globalLoader={globalLoader}
                                      path={`${url}/summary`}
                                      exact={true}
                                    >
                                      <DndProvider
                                        backend={MultiBackend}
                                        options={CustomHTML5toTouch}
                                      >
                                        <div style={summaryPageWrapper}>
                                          <EstimateSummary />
                                        </div>
                                      </DndProvider>
                                    </CustomizedRoute>
                                    <CustomizedRoute
                                      globalLoader={globalLoader}
                                      path={`${url}/measurements`}
                                      exact={true}
                                    >
                                      <div style={measurementPageWrapper}>
                                        <EstimateMeasurement
                                          hourlyRate={hourlyRate}
                                          setHourlyRate={setHourlyRate}
                                        />
                                      </div>
                                    </CustomizedRoute>
                                  </Switch>
                                </ReportProvider>
                              </ColorProvider>
                            </ProductProvider>
                          </SurfaceProductionRatesProvider>
                        </LinkingProvider>
                      </AppProvider>
                    </SurfaceSelectionProvider>
                  </RoomsProvider>
                </SessionProvider>
              </>
            )}
          />

          <Route path="/gallery">
            <SessionProvider>
              <SimpleAuthentication setGlobalLoader={setGlobalLoader} />
              <div style={imageUploadPageWrapper}>
                <ImageUpload />
              </div>
            </SessionProvider>
          </Route>

          <Route path="/linking">
            <SessionProvider>
              <SimpleAuthentication setGlobalLoader={setGlobalLoader} />
              <div style={linkingPageWrapper}>
                <EstimateLink />
              </div>
            </SessionProvider>
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
