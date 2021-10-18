import React, { useEffect, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, styled, Box, Grid, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { units, dataTypes } from '../../../../constants/addASurface';
import Toast from '../../../../Toast';

import Chip from '@material-ui/core/Chip';

const SurfaceFieldWrapper = styled(Box)({
  display: 'flex',
});

const RightFieldWrapper = styled(Box)({
  paddingLeft: 25,
});

const PreviewWrapper = styled(Box)({
  paddingBlock: 25,
});

const PreviewTyp = styled(Typography)({
  display: 'inline',
});

const LabelTyp = styled(Typography)({
  display: 'flex',
  justifyContent: 'flex-end',
  paddingTop: 8,
  height: '100%',
  paddingRight: 20,
});

const DialogContent = withStyles((theme) => ({
  root: {
    paddingBlock: 36,
    paddingInline: theme.spacing(3),
  },
}))(MuiDialogContent);

export default function AddSurfaceForm({
  isSubmitClicked,
  surface,
  setSurface,
  unitRef,
}) {
  const timer = useRef();
  useEffect(() => {
    const unit = units.find(
      (u) =>
        u.name.toLocaleLowerCase() === 'quantity' &&
        (u.symbol === 'qty' || u.symbol === 'n')
    );
    if (unit && surface.unit_id == unit.id) {
      setSurface({
        ...surface,
        formula: 'quantity',
        surfaceFields: [
          { name: 'quantity', surface_field_type_id: dataTypes[0]['id'] },
        ],
      });
      processFormulaPreview('__quantity__');
    }
  }, [surface.unit_id]);

  const processFormulaPreview = (formula) => {
    let convertedFormula = formula;
    surface.surfaceFields.map((s) => {
      s.name &&
        (convertedFormula = convertedFormula.replaceAll(
          s.name,
          `__${s.name}__`
        ));
    });
    unitRef.current = convertedFormula;
  };

  const updateFieldData = (name, value, index) => {
    const surfaceFieldsTemp = surface.surfaceFields;
    surfaceFieldsTemp[index][name] = value;
    setSurface({ ...surface, surfaceFields: surfaceFieldsTemp });
  };

  function debounce(func, timeout = 2000) {
    return (...args) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  function checkFormulaValidation(formula) {
    try {
      let convertedFormula = formula;
      surface.surfaceFields.map((s) => {
        s.name && (convertedFormula = convertedFormula.replaceAll(s.name, 10));
      });
      eval(convertedFormula);
      Toast('Surface Formula', 'Save the surface to update formula', 'success');
    } catch (e) {
      Toast(
        'Surface Formula',
        'Surface formula contains invalid expression/s!',
        'error'
      );
    }
  }

  const processChange = debounce((formula) => checkFormulaValidation(formula));
  return (
    <React.Fragment>
      <DialogContent className="scrollElement">
        <Grid container>
          <Grid item xs={12}>
            <Box height={40} />
          </Grid>
          <Grid item xs={4}>
            <LabelTyp>Name</LabelTyp>
          </Grid>

          <Grid item xs={8}>
            <TextField
              error={isSubmitClicked && !surface.name && true}
              id="standard-error-helper-text"
              value={surface.name}
              onChange={(e) => setSurface({ ...surface, name: e.target.value })}
              helperText={
                isSubmitClicked && !surface.name ? 'Name is required.' : ''
              }
              variant="outlined"
              size="small"
              style={{ width: 300 }}
            />
          </Grid>

          <Grid item xs={12}>
            <Box height={40} />
          </Grid>

          <Grid item xs={4}>
            <LabelTyp>Unit</LabelTyp>
          </Grid>

          <Grid item xs={8}>
            <Autocomplete
              value={units.find((u) => u.id === surface.unit_id) || null}
              onChange={(event, newValue) => {
                setSurface({
                  ...surface,
                  unit_id: newValue ? newValue.id : '',
                  formula: '',
                  surfaceFields: [
                    { name: '', surface_field_type_id: dataTypes[0]['id'] },
                  ],
                });
              }}
              options={units}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              size="small"
              renderOption={(option, { selected, inputValue }) => {
                const matches = match(option.name, inputValue);
                const parts = parse(option.name, matches);

                return (
                  <div>
                    {parts.map((part, index) => {
                      return (
                        <span
                          key={index}
                          style={{
                            ...(part.highlight && { color: '#1488FC' }),
                          }}
                        >
                          {part.text}
                        </span>
                      );
                    })}
                  </div>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select an Option"
                  variant="outlined"
                  error={isSubmitClicked && !surface.unit_id && true}
                  helperText={
                    isSubmitClicked && !surface.unit_id
                      ? 'Unit is required.'
                      : ''
                  }
                />
              )}
            />
          </Grid>
          {surface.unit_id && (
            <React.Fragment>
              {surface.surfaceFields.map((f, i) => (
                <React.Fragment key={i}>
                  <Grid item xs={12}>
                    <Box height={40} />
                  </Grid>

                  <Grid item xs={4}>
                    <LabelTyp>{`Surface Field ${i + 1}`}</LabelTyp>
                  </Grid>

                  <Grid item xs={8}>
                    <SurfaceFieldWrapper>
                      <TextField
                        id="standard-error-helper-text"
                        placeholder="Enter surface field name"
                        value={f.name}
                        onChange={(e) =>
                          updateFieldData('name', e.target.value, i)
                        }
                        variant="outlined"
                        size="small"
                        style={{ width: 300 }}
                      />

                      <RightFieldWrapper>
                        <Autocomplete
                          value={
                            dataTypes.find(
                              (u) =>
                                u.id ===
                                surface.surfaceFields[i][
                                  'surface_field_type_id'
                                ]
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            updateFieldData(
                              'surface_field_type_id',
                              newValue ? newValue.id : '',
                              i
                            );
                          }}
                          options={dataTypes}
                          getOptionLabel={(option) => option.title}
                          style={{ width: 300 }}
                          size="small"
                          renderOption={(option, { selected, inputValue }) => {
                            const matches = match(option.title, inputValue);
                            const parts = parse(option.title, matches);

                            return (
                              <div>
                                {parts.map((part, index) => {
                                  return (
                                    <span
                                      key={index}
                                      style={{
                                        ...(part.highlight && {
                                          color: '#1488FC',
                                        }),
                                      }}
                                    >
                                      {part.text}
                                    </span>
                                  );
                                })}
                              </div>
                            );
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select an Option"
                              variant="outlined"
                            />
                          )}
                        />
                      </RightFieldWrapper>
                    </SurfaceFieldWrapper>
                  </Grid>
                </React.Fragment>
              ))}

              <Grid item xs={12}>
                <Box height={20} />
              </Grid>

              <Grid item xs={4} />

              <Grid item xs={8}>
                <Button
                  onClick={() => {
                    setSurface({
                      ...surface,
                      surfaceFields: [
                        ...surface.surfaceFields,
                        { name: '', surface_field_type_id: dataTypes[0]['id'] },
                      ],
                    });
                  }}
                  color="primary"
                  variant="text"
                  disabled={surface.surfaceFields.length === 5}
                >
                  Add Fields
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box height={20} />
              </Grid>

              <Grid item xs={4}>
                <LabelTyp>Formula</LabelTyp>
              </Grid>

              <Grid item xs={8}>
                <TextField
                  error={isSubmitClicked && !surface.formula && true}
                  id="standard-error-helper-text"
                  placeholder="Enter the surface formula here"
                  value={surface.formula}
                  onChange={(e) => {
                    processFormulaPreview(e.target.value);
                    setSurface({ ...surface, formula: e.target.value });
                    e.target.value && processChange(e.target.value);
                  }}
                  helperText={
                    isSubmitClicked && !surface.formula
                      ? 'Formula is required.'
                      : ''
                  }
                  variant="outlined"
                  size="small"
                  style={{ width: 300 }}
                />
              </Grid>

              {surface.formula && (
                <React.Fragment>
                  <Grid item xs={4} />
                  <Grid item xs={8}>
                    <PreviewWrapper>
                      <PreviewTyp>Preview: </PreviewTyp>
                      {unitRef.current.split('__').map((u, i) => {
                        if (
                          u &&
                          surface.surfaceFields.find((s) => s.name === u)
                        ) {
                          return <Chip label={u} key={i} />;
                        } else if (u) {
                          return <PreviewTyp key={i}>{u}</PreviewTyp>;
                        } else {
                          return '';
                        }
                      })}
                    </PreviewWrapper>
                  </Grid>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Grid>
      </DialogContent>
    </React.Fragment>
  );
}
