import React, { useEffect, useState } from 'react';
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
import { getActions } from '../../../../../api/estimateAction';
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
  color: '#1488FC',
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

export default function PRForm({
  isSubmitClicked,
  actions,
  setActions,
  surfaceId,
  actionsContainPRRates,
  setActionsContainPRRates,
}) {
  const [selectedAction, setSelectedAction] = useState(null);
  const [loading, setLoading] = useState(false);
  const sessionDispatch = useSessionDispatch();
  const [
    selectedActionContainPRRates,
    setSelectedActionContainPRRates,
  ] = useState(null);

  useEffect(() => {
    setActionsContainPRRates(
      actionsContainPRRates
        .concat(actions)
        .filter(function (c) {
          return this.has(c.id) ? false : this.add(c.id);
        }, new Set())
        .filter((a) => {
          const action = actions.find((ac) => ac.id == a.id);
          if (action) return action.workRate && action.spreadRate;
          return false;
        })
    );
  }, [actions]);

  useEffect(() => {
    selectedActionContainPRRates &&
      setSelectedAction(selectedActionContainPRRates);
  }, [selectedActionContainPRRates]);

  useEffect(() => {
    if (selectedAction) {
      const selectedOne = actions.find((a) => a.id === selectedAction.id);
      selectedOne &&
        (selectedOne.workRate && selectedOne.spreadRate
          ? selectedAction.id !== selectedActionContainPRRates &&
            setSelectedActionContainPRRates(selectedOne)
          : setSelectedActionContainPRRates(null));
    } else {
      selectedActionContainPRRates && setSelectedActionContainPRRates(null);
    }
  }, [actions, selectedAction]);

  useEffect(() => {
    if (actions.length === 0) {
      setLoading(true);
      getActions(sessionDispatch).then((res) => {
        setLoading(false);
        setActions(res);
      });
    }
  }, []);

  return (
    <React.Fragment>
      <DialogContent className="scrollElement">
        {loading ? (
          <LoadingWrapper>
            <CircularProgress />
          </LoadingWrapper>
        ) : (
          <Grid container>
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
            <Grid item xs={12}>
              <Box height={40} />
            </Grid>

            <Grid item xs={4}>
              <LabelTyp>Select Action</LabelTyp>
            </Grid>

            <Grid item xs={8}>
              <Autocomplete
                value={
                  selectedAction
                    ? actions.find((a) => a.id == selectedAction.id)
                    : null
                }
                onChange={(event, newValue) => {
                  newValue
                    ? setSelectedAction(newValue)
                    : setSelectedAction(null);
                }}
                options={actions}
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

            {selectedAction && (
              <React.Fragment>
                <Grid item xs={4}>
                  <LabelTyp>Work Rate</LabelTyp>
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    id="standard-error-helper-text"
                    value={
                      actions.find((a) => a.id == selectedAction.id).workRate ||
                      ''
                    }
                    onChange={(e) =>
                      setActions(
                        actions.map((a) =>
                          a.id == selectedAction.id
                            ? {
                                ...a,
                                workRate:
                                  e.target.value === 0 || e.target.value
                                    ? parseInt(e.target.value)
                                    : e.target.value,
                              }
                            : a
                        )
                      )
                    }
                    variant="outlined"
                    type="number"
                    size="small"
                    style={{ width: 300 }}
                    error={
                      actionsContainPRRates.length === 0 &&
                      isSubmitClicked &&
                      !actions.find((a) => a.id == selectedAction.id)
                        .workRate &&
                      true
                    }
                    helperText={
                      actionsContainPRRates.length === 0 &&
                      isSubmitClicked &&
                      !actions.find((a) => a.id == selectedAction.id).workRate
                        ? 'Work Rate is required.'
                        : ''
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box height={40} />
                </Grid>

                <Grid item xs={4}>
                  <LabelTyp>Spread Rate</LabelTyp>
                </Grid>

                <Grid item xs={8}>
                  <TextField
                    id="standard-error-helper-text"
                    value={
                      actions.find((a) => a.id == selectedAction.id)
                        .spreadRate || ''
                    }
                    onChange={(e) =>
                      setActions(
                        actions.map((a) =>
                          a.id == selectedAction.id
                            ? {
                                ...a,
                                spreadRate:
                                  e.target.value === 0 || e.target.value
                                    ? parseInt(e.target.value)
                                    : e.target.value,
                              }
                            : a
                        )
                      )
                    }
                    variant="outlined"
                    type="number"
                    size="small"
                    style={{ width: 300 }}
                    error={
                      actionsContainPRRates.length === 0 &&
                      isSubmitClicked &&
                      !actions.find((a) => a.id == selectedAction.id)
                        .spreadRate &&
                      true
                    }
                    helperText={
                      actionsContainPRRates.length === 0 &&
                      isSubmitClicked &&
                      !actions.find((a) => a.id == selectedAction.id).spreadRate
                        ? 'Spread Rate is required.'
                        : ''
                    }
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
