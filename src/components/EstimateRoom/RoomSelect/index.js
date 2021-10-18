import React, { useRef } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  useRoomsState,
  useRoomsDispatch,
  updateName,
  addNewRoom,
  updateRoomPosition,
} from '../../../Context/RoomSelectionContext';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

const textFieldStyle = {
  background: '#ffff',
  marginTop: '10px',
  marginBottom: '10px',
  width: 250,
};

export default function RoomSelect(props) {
  const {
    roomCategory_Id,
    room_Id,
    open,
    setRoomSelectShow,
    getNewRoomId,
  } = props;
  const roomsState = useRoomsState();
  const roomsDispatch = useRoomsDispatch();
  const highlightOptionRef = useRef(null);
  const options = Object.keys(roomsState[roomCategory_Id]['bedrooms'])
    .filter((roomId) => roomId !== room_Id)
    .map((roomId) => roomsState[roomCategory_Id]['bedrooms'][roomId]['name']);
  const [inputVal, setInputVal] = React.useState(
    roomsState[roomCategory_Id]['bedrooms'][room_Id]['name']
  );

  return (
    <Autocomplete
      freeSolo
      value={roomsState[roomCategory_Id]['bedrooms'][room_Id]['name']}
      options={options.map((option) => option)}
      size="small"
      autoHighlight={true}
      onHighlightChange={(event, option, reason) =>
        (highlightOptionRef.current = option)
      }
      inputValue={inputVal}
      onInputChange={(event, newInputValue) => {
        setInputVal(newInputValue);
      }}
      onChange={(e, allValues, type, value) => {
        const selectedOption = value ? value.option : '';
        setInputVal(selectedOption);
      }}
      renderOption={(option, { inputValue }) => {
        const matches = match(option, inputVal);
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
        if (inputVal != '') {
          options = options
            .filter(
              (option) =>
                option.toLowerCase().indexOf(inputVal.toLowerCase()) === 0 &&
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
          style={textFieldStyle}
          onBlur={(e) => {
            updateName(roomsDispatch, {
              roomCategory_Id: roomCategory_Id,
              room_Id: room_Id,
              value: e.target.value,
            });
            setRoomSelectShow(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              e.preventDefault();
              highlightOptionRef.current &&
                setInputVal(highlightOptionRef.current + ' ');
            } else if (
              e.key === 'Enter' &&
              (window.preKeyCode
                ? window.preKeyCode < 37 || window.preKeyCode > 40
                : true)
            ) {
              if (highlightOptionRef.current) {
                updateName(roomsDispatch, {
                  roomCategory_Id: roomCategory_Id,
                  room_Id: room_Id,
                  value: highlightOptionRef.current,
                });
                highlightOptionRef.current = undefined;
              }
              const id = `${getNewRoomId()}`;
              addNewRoom(roomsDispatch, {
                roomCategory_Id: roomCategory_Id,
                room_Id: id,
                included: true,
                roomName: '',
              });
              updateRoomPosition(roomsDispatch, {
                roomCategory_Id,
                room_Id,
                newRoomId: id,
              });
            }
            window.preKeyCode = e.keyCode;
          }}
          variant="outlined"
        />
      )}
    />
  );
}
