import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  useRoomsState,
  useRoomsDispatch,
  updateCategoryName,
  addNewRoom,
  addRoomOnTop,
} from '../../../Context/RoomSelectionContext';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

const textFieldSize = {
  background: '#ffff',
  marginTop: '10px',
  marginBottom: '10px',
  width: 250,
};

export default function CategorySelect(props) {
  const {
    roomCategory_Id,
    open,
    setCategorySelectShow,
    expanded,
    setCollapseAll,
    setExpandIcon,
    setExpanded,
    getNewRoomId,
  } = props;
  const roomsState = useRoomsState();
  const roomsDispatch = useRoomsDispatch();
  const options = Object.keys(roomsState)
    .filter((categoryId) => categoryId !== roomCategory_Id)
    .map((categoryId) => roomsState[categoryId]['name']);
  return (
    <Autocomplete
      freeSolo
      value={roomsState[roomCategory_Id]['name']}
      options={options.map((option) => option)}
      size="small"
      onChange={(e, allValues, type, value) => {
        const selectedOption = value ? value.option : '';
        updateCategoryName(roomsDispatch, {
          roomCategory_Id: roomCategory_Id,
          value: selectedOption,
        });
      }}
      renderOption={(option, { inputValue }) => {
        const matches = match(option, inputValue);
        const parts = parse(option, matches);

        return (
          <div>
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
      filterOptions={(options, { inputValue }) => {
        if (inputValue != '') {
          options = options
            .filter(
              (option) =>
                option.toLowerCase().indexOf(inputValue.toLowerCase()) === 0 &&
                option !== ''
            )
            .filter((item, i, ar) => ar.indexOf(item) === i);
          return options;
        } else
          return options
            .filter((option) => option !== '')
            .filter((item, i, ar) => ar.indexOf(item) === i);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus={!open}
          onBlur={(e) => {
            roomsState[roomCategory_Id]['name'] !== '' &&
              setCategorySelectShow(false);
            updateCategoryName(roomsDispatch, {
              roomCategory_Id: roomCategory_Id,
              value: e.target.value,
            });
          }}
          style={textFieldSize}
          onKeyDown={(e) => {
            if (
              e.keyCode === 13 &&
              (window.preKeyCode
                ? window.preKeyCode < 37 || window.preKeyCode > 40
                : true)
            ) {
              roomsState[roomCategory_Id]['name'] !== '' &&
                setCategorySelectShow(false);
              const id = `${getNewRoomId()}`;
              setCollapseAll(false);
              setExpanded(true);
              setExpandIcon('Less');

              setTimeout(
                () => {
                  addNewRoom(roomsDispatch, {
                    roomCategory_Id: roomCategory_Id,
                    room_Id: id,
                    included: true,
                    roomName: '',
                  });
                  addRoomOnTop(roomsDispatch, {
                    roomCategory_Id,
                    room_Id: id,
                  });
                },
                expanded ? 0 : 500
              );
            }
            window.preKeyCode = e.keyCode;
          }}
          variant="outlined"
        />
      )}
    />
  );
}
