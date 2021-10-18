import React, { createRef, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  styled,
  Box,
  Grid,
  TextField,
  Typography,
  withStyles,
  CircularProgress,
  Checkbox,
  Button,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CategoryContainer from './CategoryContainer';
import {
  useRoomsState,
  useRoomsDispatch,
  loadRoomContext,
  addSelectedValue,
  addNewRoom,
  updateRoomPosition,
  addNewCategory,
} from '../../Context/RoomSelectionContext';

import { getRooms } from '../../api/estimateRoom';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useSessionState, useSessionDispatch } from '../../Context/Session';

const includeColumn = {
  textAlign: 'center',
  background: '#f5f6f8',
  fontFamily: 'Medium',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

const excludeColumn = {
  textAlign: 'center',
  background: '#ffffff',
  fontFamily: 'Medium',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
};

const checkboxColumnStyling = {
  padding: '12px',
};
const includeRightBorder = {
  borderTopLeftRadius: '5px',
};

const RoomWrapper = styled(Box)({
  minWidth: 800,
  maxWidth: 1200,
  margin: 'auto',
  paddingRight: 70,
});

const SaveRoomsWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 40,
});
const IncudeWrapper = styled(Box)({
  ...includeColumn,
  ...checkboxColumnStyling,
  ...includeRightBorder,
  padding: '20px',
  fontSize: '15px',
});

const ExcludeWrapper = styled(Box)({
  ...excludeColumn,
  ...checkboxColumnStyling,
  padding: '20px',
  fontSize: '15px',
});

const ActionWrapper = styled(Box)({
  ...excludeColumn,
  ...checkboxColumnStyling,
  padding: '20px',
  fontSize: '15px',
});

const DropdownWrapper = styled(Box)({
  marginBottom: 20,
  display: 'flex',
  justifyContent: 'flex-end',
});

const LoadingWrapper = styled(Box)({
  minHeight: window.innerHeight - 270,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const NoOptionTyp = styled(Typography)({
  cursor: 'pointer',
  color: 'rgba(0, 0, 0, 0.85)',
  '&:hover': {},
});

const NewRoomWrapper = styled(Box)({
  background: '#ffffff',
  borderTopLeftRadius: '5px',
  borderRight: '1px solid #E3E8EE',
  borderBottom: '1px solid #E3E8EE',
  padding: '20px 12px 20px 30px',
  fontSize: '15px',
  color: '#76b9fd',
  cursor: 'pointer',
});

const StyledAutoComplete = withStyles({
  root: {
    margin: '8px 0px',
    '& .MuiFormControl-root': {
      width: 300,
    },
    '& .MuiInputBase-root': {
      background: '#ffff',
    },
  },
})(Autocomplete);
const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function EstimateRoom(props) {
  const sessionState = useSessionState();
  const roomsDispatch = useRoomsDispatch();

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [textFieldVal, setTextFieldVal] = useState('');
  const [collapseAll, setCollapseAll] = useState(false);
  const [newRoomId, setNewRoomId] = useState(0);
  const [newCategoryId, setNewCategoryId] = useState(0);
  const roomsState = useRoomsState();
  const multiSelectTextRef = createRef();
  const sessionDispatch = useSessionDispatch();
  const noRoomCategoryId = useRef(null);
  useEffect(() => {
    if (Object.entries(roomsState).length > 0) {
      return undefined;
    }
    getRooms(sessionDispatch)
      .then((res) => {
        loadRoomContext(roomsDispatch, { rooms: res });
        updateOptionsOfDropdown(res);
        const allRoomIds = [].concat.apply(
          [],
          Object.keys(res).map((cId) =>
            Object.keys(res[cId]['bedrooms']).map(
              (rId) => rId.split('_')[rId.split('_').length - 1]
            )
          )
        );
        Object.entries(res).length > 0 &&
          setNewCategoryId(
            Math.max(
              ...Object.keys(res).map(
                (key) => key.split('_')[key.split('_').length - 1]
              )
            ) + 1
          );
        if (allRoomIds.length < 1) return;
        setNewRoomId(Math.max(...allRoomIds) + 1);
      })
      .catch((err) => alert(err));
  }, [sessionState.expired]);

  useEffect(() => {
    if (Object.entries(roomsState).length < 1) {
      return undefined;
    }
    const allRoomIds = [].concat.apply(
      [],
      Object.keys(roomsState).map((cId) =>
        Object.keys(roomsState[cId]['bedrooms']).map(
          (rId) => rId.split('_')[rId.split('_').length - 1]
        )
      )
    );
    Object.entries(roomsState).length > 0 &&
      setNewCategoryId(
        Math.max(
          ...Object.keys(roomsState).map(
            (key) => key.split('_')[key.split('_').length - 1]
          )
        ) + 1
      );
    if (allRoomIds.length < 1) return;
    setNewRoomId(Math.max(...allRoomIds) + 1);
  }, []);

  useEffect(() => {
    updateOptionsOfDropdown(roomsState);
  }, [roomsState]);

  useEffect(() => {
    if (
      noRoomCategoryId.current === null &&
      Object.entries(roomsState).length > 0
    ) {
      noRoomCategoryId.current = Object.keys(roomsState).find(
        (r) => roomsState[r]['name'] === 'No Category Rooms'
      );
    }
  }, [roomsState]);
  const getNewRoomId = () => {
    let id = newRoomId;
    setNewRoomId(newRoomId + 1);
    return id;
  };
  const getNewCategoryId = () => {
    let id = newCategoryId;
    setNewCategoryId(newCategoryId + 1);
    return id;
  };
  const updateOptionsOfDropdown = (rooms) => {
    if (Object.keys(rooms).length === 0) {
      return;
    }
    let arr = [];
    Object.keys(rooms).map((parentRoomsId) =>
      Object.keys(rooms[parentRoomsId]['bedrooms']).map((roomId) =>
        arr.push({
          ...rooms[parentRoomsId]['bedrooms'][roomId],
          ...(rooms[parentRoomsId]['name'] !== 'No Room Category' && {
            parent_name: rooms[parentRoomsId]['name'],
          }),
          parent_id: parentRoomsId,
          id: roomId,
        })
      )
    );

    arr.push({ default: true, name: 'Default' });
    setOptions(arr);
  };

  if (Object.entries(roomsState).length < 1) {
    return (
      <LoadingWrapper>
        <CircularProgress color="primary" />
      </LoadingWrapper>
    );
  }
  return (
    <RoomWrapper>
      <DropdownWrapper>
        <StyledAutoComplete
          id="asynchronous-demo"
          multiple
          closeIcon={false}
          autoHighlight
          openOnFocus
          disableCloseOnSelect
          noOptionsText={
            <NoOptionTyp
              onMouseDown={() => {
                const id = getNewRoomId();
                addNewRoom(roomsDispatch, {
                  roomCategory_Id: noRoomCategoryId.current,
                  room_Id: id,
                  included: true,
                  roomName: textFieldVal,
                });
                updateRoomPosition(roomsDispatch, {
                  roomCategory_Id: noRoomCategoryId.current,
                  room_Id: id,
                  newRoomId: id,
                });
                setTextFieldVal('');
              }}
            >
              + Add {textFieldVal}
            </NoOptionTyp>
          }
          onChange={(e, allValues, type, value) => {
            const selectedOption = value.option;
            let selectedValue = false;
            if (selectedOption.default) {
              setOpen(false);
              const id = getNewRoomId();

              addNewRoom(roomsDispatch, {
                roomCategory_Id: noRoomCategoryId.current,
                room_Id: id,
                included: true,
                roomName: textFieldVal,
              });
              updateRoomPosition(roomsDispatch, {
                roomCategory_Id: noRoomCategoryId.current,
                room_Id: id,
                newRoomId: id,
              });
              setTextFieldVal('');
              return;
            }
            if (
              !roomsState[selectedOption.parent_id]['bedrooms'][
                selectedOption.id
              ]['selected']
            )
              selectedValue = true;
            addSelectedValue(roomsDispatch, {
              roomCategory_Id: selectedOption.parent_id,
              room_Id: selectedOption.id,
              selectedValue,
            });
            multiSelectTextRef.current.childNodes[1].children[0].select();
          }}
          groupBy={(option) => option.parent_name}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          getOptionSelected={(option, value) => {
            return option.selected;
          }}
          getOptionLabel={(option) => option.name}
          options={options}
          blurOnSelect={false}
          value={options.filter((o) => o.selected)}
          filterOptions={(options, { inputValue, selected }) => {
            if (inputValue != '') {
              options = options.filter((option) =>
                option.name.toLowerCase().includes(inputValue.toLowerCase())
              );
              if (!options.find((o) => o.default) && options.length >= 1) {
                options.push({ default: true, name: 'Default' });
              }
              return options;
            } else return options;
          }}
          renderOption={(option, { selected, inputValue }) => {
            if (option.default) {
              return (
                <NoOptionTyp
                  onMouseDown={() => {
                    const id = getNewRoomId(roomsState);

                    addNewRoom(roomsDispatch, {
                      roomCategory_Id: noRoomCategoryId.current,
                      room_Id: id,
                      included: true,
                      roomName: textFieldVal,
                    });
                    updateRoomPosition(roomsDispatch, {
                      roomCategory_Id: noRoomCategoryId.current,
                      room_Id: id,
                      newRoomId: id,
                    });
                  }}
                >
                  + Add {textFieldVal}
                </NoOptionTyp>
              );
            }
            const matches = match(option.name, inputValue);
            const parts = parse(option.name, matches);

            return (
              <div>
                <Checkbox
                  icon={icon}
                  color="primary"
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                  onChange={(e) => {
                    addSelectedValue(roomsDispatch, {
                      roomCategory_Id: option.parent_id,
                      room_Id: option.id,
                      selectedValue: e.target.checked,
                    });
                  }}
                />
                {parts.map((part, index) => {
                  return (
                    <span
                      key={index}
                      style={{ ...(part.highlight && { color: '#1488FC' }) }}
                    >
                      {part.text}
                    </span>
                  );
                })}
              </div>
            );
          }}
          inputValue={textFieldVal}
          onInputChange={(event, newInputValue, reason) => {
            setTextFieldVal(reason === 'input' ? newInputValue : textFieldVal);
          }}
          renderTags={() => {}}
          renderInput={(params, val) => {
            return (
              <TextField
                ref={multiSelectTextRef}
                {...params}
                variant="outlined"
                label="Select Rooms"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            );
          }}
        />
      </DropdownWrapper>

      <Grid container spacing={0}>
        <Grid item xs={6}></Grid>
        <Grid item xs={2}>
          <IncudeWrapper>Include</IncudeWrapper>
        </Grid>
        <Grid item xs={2}>
          <ExcludeWrapper>Exclude</ExcludeWrapper>
        </Grid>
        <Grid item xs={2}>
          <ActionWrapper>Actions</ActionWrapper>
        </Grid>
        <Grid item xs={12}>
          <NewRoomWrapper
            onClick={() => {
              const id = getNewCategoryId(roomsState);
              setTimeout(
                () => {
                  addNewCategory(roomsDispatch, {
                    roomCategory_Id: id,
                    value: '',
                  });
                },
                collapseAll ? 0 : 500
              );
              !collapseAll && setCollapseAll(true);
            }}
          >
            Add new category
          </NewRoomWrapper>
        </Grid>
      </Grid>

      {Object.keys(roomsState)
        .sort((a, b) => roomsState[a]['position'] - roomsState[b]['position'])
        .map((Pkey, index) => {
          if (!roomsState[Pkey]['selected']) return;

          return (
            <div style={{ overflow: 'hidden', clear: 'both' }} key={Pkey}>
              <CategoryContainer
                roomCategory_Id={Pkey}
                open={open}
                collapseAll={collapseAll}
                setCollapseAll={setCollapseAll}
                getNewRoomId={getNewRoomId}
              />
            </div>
          );
        })}
      <SaveRoomsWrapper>
        <Link to={{ pathname: `/estimates/surfaces`, prevPath: 'rooms' }}>
          <StyledButton size="large" color="primary" variant="contained">
            Save And Continue
          </StyledButton>
        </Link>
      </SaveRoomsWrapper>
    </RoomWrapper>
  );
}

EstimateRoom.defaultProps = {};

EstimateRoom.propTypes = {
  estimateRoom: PropTypes.array,
};
export default EstimateRoom;
