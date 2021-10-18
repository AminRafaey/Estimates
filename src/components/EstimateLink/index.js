import React, { useState } from 'react';
import { Typography, styled, Box } from '@material-ui/core';
import ToggleButton from '../ToggleButton';
import NewLink from './NewLink';
import MyLinks from './MyLinks';

const HeaderWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const LinkingTyp = styled(Typography)({
  fontSize: 22,
  paddingLeft: '17.5vw',
  color: '#9A9A9D',
});
const ToggleButtonWrapper = styled(Box)({
  paddingRight: '17.5vw',
});

function EstimateLink(props) {
  const [LinkPageOption, setLinkPageOption] = useState('myLinks');
  const [fieldIds, setFieldIds] = useState([]);
  const [editGroupId, setEditGroupId] = useState(null);

  return (
    <React.Fragment>
      <HeaderWrapper>
        <LinkingTyp>Linking</LinkingTyp>
        <ToggleButtonWrapper>
          <ToggleButton
            toggleArray={[
              { label: 'My Links', value: 'myLinks' },
              { label: 'New Link', value: 'newLink' },
            ]}
            handler={(label) => setLinkPageOption(label)}
            selected={LinkPageOption}
          />
        </ToggleButtonWrapper>
      </HeaderWrapper>
      {LinkPageOption == 'newLink' ? (
        <NewLink
          fieldIds={fieldIds}
          setFieldIds={setFieldIds}
          editGroupId={editGroupId}
          setEditGroupId={setEditGroupId}
          setLinkPageOption={setLinkPageOption}
        />
      ) : (
        <MyLinks
          setFieldIds={setFieldIds}
          setEditGroupId={setEditGroupId}
          setLinkPageOption={setLinkPageOption}
        />
      )}
    </React.Fragment>
  );
}
export default EstimateLink;
