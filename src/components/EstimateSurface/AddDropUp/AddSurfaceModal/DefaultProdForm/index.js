import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  styled,
  Box,
  Grid,
  TextField,
  CircularProgress,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { Checkbox } from '../../../../UI';
import { getProductsAtTheGo } from '../../../../../api/estimateProduct';
import { useSessionDispatch } from '../../../../../Context/Session';

const LabelTyp = styled(Typography)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  height: '100%',
  paddingRight: 20,
});

const ActionWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginRight: 20,
});

const ActionNameTyp = styled(Typography)({
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
});

const ActionsWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
});

const LoadingWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const DialogContent = withStyles((theme) => ({
  root: {
    paddingBlock: 36,
    paddingInline: theme.spacing(3),
  },
}))(MuiDialogContent);

export default function DefaultProdForm({
  products,
  setProducts,
  actionsContainPRRates,
  setActionsContainPRRates,
}) {
  const [
    selectedActionContainPRRates,
    setSelectedActionContainPRRates,
  ] = useState(null);
  const [loading, setLoading] = useState(false);
  const sessionDispatch = useSessionDispatch();

  useEffect(() => {
    if (products.length === 0) {
      setLoading(true);
      getProductsAtTheGo(sessionDispatch).then((res) => {
        setLoading(false);
        setProducts(res);
      });
    }
  }, []);

  const isDefaultProductAdded = (id) => {
    const actionContainPRRates = actionsContainPRRates.find((a) => a.id === id);
    if (
      actionContainPRRates.product &&
      (actionContainPRRates.product.has_coats
        ? actionContainPRRates.product.component &&
          actionContainPRRates.product.sheen
        : true)
    )
      return true;
    return false;
  };

  return (
    <React.Fragment>
      <DialogContent className="scrollElement">
        {loading ? (
          <LoadingWrapper>
            <CircularProgress />
          </LoadingWrapper>
        ) : (
          <Grid container>
            <Grid item xs={12}>
              <Box height={40} />
            </Grid>

            {actionsContainPRRates.length > 0 && (
              <React.Fragment>
                <Grid item xs={12}>
                  <Box height={40} />
                </Grid>

                <Grid item xs={4}>
                  <LabelTyp>Production rates added for</LabelTyp>
                </Grid>

                <Grid item xs={7}>
                  <ActionsWrapper>
                    {actionsContainPRRates.map((a, i) => (
                      <ActionWrapper key={i}>
                        <Checkbox
                          color="primary"
                          onChange={(e) =>
                            e.target.checked
                              ? setSelectedActionContainPRRates(a)
                              : setSelectedActionContainPRRates(null)
                          }
                          checked={
                            selectedActionContainPRRates
                              ? a.id === selectedActionContainPRRates.id
                              : false
                          }
                        />
                        <ActionNameTyp
                          onClick={() => setSelectedActionContainPRRates(a)}
                          style={{
                            ...(isDefaultProductAdded(a.id) && {
                              color: '#1488FC',
                            }),
                          }}
                        >
                          {a.name}
                        </ActionNameTyp>
                      </ActionWrapper>
                    ))}
                  </ActionsWrapper>
                </Grid>
                <Grid item xs={1} />
              </React.Fragment>
            )}

            {actionsContainPRRates.length > 0 && selectedActionContainPRRates && (
              <React.Fragment>
                <Grid item xs={12}>
                  <Box height={40} />
                </Grid>
                <Grid item xs={4}>
                  <LabelTyp>Select Product</LabelTyp>
                </Grid>
                <Grid item xs={8}>
                  <Autocomplete
                    value={(function () {
                      const selected = actionsContainPRRates.find(
                        (a) => a.id === selectedActionContainPRRates.id
                      ).product;
                      if (selected) {
                        return products.find((a) => a.id == selected.id);
                      } else {
                        return null;
                      }
                    })()}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        const {
                          components,
                          sheens,
                          ...remainingProd
                        } = newValue;
                        setActionsContainPRRates(
                          actionsContainPRRates.map((p) =>
                            p.id === selectedActionContainPRRates.id
                              ? {
                                  ...p,
                                  product: remainingProd,
                                }
                              : p
                          )
                        );
                      } else {
                        setActionsContainPRRates(
                          actionsContainPRRates.map((p) =>
                            p.id === selectedActionContainPRRates.id
                              ? {
                                  ...p,
                                  product: undefined,
                                }
                              : p
                          )
                        );
                      }
                    }}
                    options={products}
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
                      />
                    )}
                  />
                </Grid>{' '}
              </React.Fragment>
            )}

            <Grid item xs={12}>
              <Box height={40} />
            </Grid>

            {actionsContainPRRates.length > 0 &&
              selectedActionContainPRRates &&
              actionsContainPRRates.find(
                (a) => a.id === selectedActionContainPRRates.id
              ).product &&
              actionsContainPRRates.find(
                (a) => a.id === selectedActionContainPRRates.id
              ).product.has_coats && (
                <React.Fragment>
                  <Grid item xs={4}>
                    <LabelTyp>Select Component</LabelTyp>
                  </Grid>

                  <Grid item xs={8}>
                    <Autocomplete
                      value={(function () {
                        const selected = actionsContainPRRates.find(
                          (a) => a.id === selectedActionContainPRRates.id
                        ).product;
                        if (selected.component) {
                          return products
                            .find((a) => a.id == selected.id)
                            .components.find(
                              (c) => c.id == selected.component.id
                            );
                        } else {
                          return null;
                        }
                      })()}
                      onChange={(event, newValue) => {
                        setActionsContainPRRates(
                          actionsContainPRRates.map((p) =>
                            p.id === selectedActionContainPRRates.id
                              ? {
                                  ...p,
                                  product: {
                                    ...p.product,
                                    component: newValue,
                                  },
                                }
                              : p
                          )
                        );
                      }}
                      options={
                        products.find(
                          (a) =>
                            a.id ==
                            actionsContainPRRates.find(
                              (a) => a.id === selectedActionContainPRRates.id
                            ).product.id
                        ).components
                      }
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
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box height={40} />
                  </Grid>

                  <Grid item xs={4}>
                    <LabelTyp>Select Sheen</LabelTyp>
                  </Grid>

                  <Grid item xs={8}>
                    <Autocomplete
                      value={(function () {
                        const selected = actionsContainPRRates.find(
                          (a) => a.id === selectedActionContainPRRates.id
                        ).product;
                        if (selected.sheen) {
                          return products
                            .find((a) => a.id == selected.id)
                            .sheens.find((c) => c.id == selected.sheen.id);
                        } else {
                          return null;
                        }
                      })()}
                      onChange={(event, newValue) => {
                        setActionsContainPRRates(
                          actionsContainPRRates.map((p) =>
                            p.id === selectedActionContainPRRates.id
                              ? {
                                  ...p,
                                  product: {
                                    ...p.product,
                                    sheen: newValue,
                                  },
                                }
                              : p
                          )
                        );
                      }}
                      options={
                        products.find(
                          (a) =>
                            a.id ==
                            actionsContainPRRates.find(
                              (a) => a.id === selectedActionContainPRRates.id
                            ).product.id
                        ).sheens
                      }
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
                        />
                      )}
                    />
                  </Grid>
                </React.Fragment>
              )}
          </Grid>
        )}
      </DialogContent>
    </React.Fragment>
  );
}
