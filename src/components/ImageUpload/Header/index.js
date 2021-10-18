import React, { useState, useRef, useEffect } from 'react';
import Navlink from './NavLink';

import { InputBase, styled, Box, Button, withStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import ImagesUploadDialogue from '../ImagesUploadDialogue';
import { useWidth } from '../../Assets';
import { ProductIcon } from '../../../resources';
import Settings from '../../EstimateHeader/Settings';

const HeaderContainer = styled(Box)({
  display: 'flex',
  height: '100%',
});

const StyledHeader = styled(Box)({
  boxShadow: 'none',
  borderBottom: '1px solid #eff2f5',
  width: '100%',
  zIndex: 1100,
  background: '#ffff',
  display: 'flex',
});

const ContentWrapper = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const HeaderWrapper = styled(Box)({
  width: '100%',
  background: '#ffff',
  borderRadius: 5,
  '&:hover': {
    backgroundColor: '#F8F8F8',
  },
});

const HeaderParentWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: 170,
  paddingInline: 80,
});

const SettingWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  paddingInline: 26,
  paddingTop: 4,
});

const useStyles = makeStyles((theme) => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    width: '100%',
    height: 45,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: '100%',
  },
}));
const StyledButton = withStyles({
  root: {
    textTransform: 'none',
  },
})(Button);
export default function Header(props) {
  const {
    imageFiles,
    setImageFiles,
    searchValue,
    setSearchValue,
    setImageUploadCount,
    estimates,
    getEstimatesLoader,
    selected,
    setSelected,
  } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const [value, setValue] = useState('');
  const searchValueRef = useRef(value);
  const width = useWidth();

  useEffect(() => {
    searchValueRef.current = value;
  }, [value]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function debounce(func, timeout = 2000) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  const processChange = debounce(() => setSearchValue(searchValueRef.current));

  return (
    <div>
      <StyledHeader position="fixed" color="secondary">
        <HeaderContainer>
          {headerSteps.map((headerStep, index) => {
            return (
              <Navlink
                step={headerStep}
                width={width}
                key={index}
                estimates={estimates}
                getEstimatesLoader={getEstimatesLoader}
                selected={selected}
                setSelected={setSelected}
              />
            );
          })}
        </HeaderContainer>

        <ContentWrapper>
          <StyledButton
            variant="contained"
            color="primary"
            size="small"
            onClick={handleClickOpen}
          >
            Add Images
          </StyledButton>
          <SettingWrapper>
            <Settings topMargin={26} />
          </SettingWrapper>
        </ContentWrapper>
      </StyledHeader>
      <HeaderParentWrapper>
        <HeaderWrapper>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              fullWidth={true}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                processChange();
              }}
              inputProps={{ 'aria-label': 'search' }}
              autoFocus={true}
            />
          </div>
        </HeaderWrapper>

        <ImagesUploadDialogue
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          open={open}
          handleClose={handleClose}
          setImageUploadCount={setImageUploadCount}
        />
      </HeaderParentWrapper>
    </div>
  );
}

const headerSteps = [
  {
    name: 'imageUpload',
    title: 'Image Gallery',
    icon: <ProductIcon />,
  },
];
