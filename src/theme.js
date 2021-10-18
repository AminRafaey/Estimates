import { createMuiTheme } from '@material-ui/core/styles';
import { HighlightColor } from './components/constants/theme';

export const theme = createMuiTheme({
  overrides: {
    MuiOutlinedInput: {
      input: {
        height: 17,
      },
      notchedOutline: {
        borderColor: '#EDEDED',
      },
      root: {
        '&:hover $notchedOutline': {
          borderColor: '#EDEDED',
        },
      },
    },
    MuiTabs: {
      vertical: {
        '& .MuiButtonBase-root': {
          maxWidth: 'inherit',
          border: '1px solid #E3E8EE',
          textTransform: 'capitalize',
          borderTop: 'none',
          textAlign: 'left',
          '&:first-child:not(.Mui-selected) ': {
            borderTop: '1px solid #E3E8EE',
          },
        },
        '& .Mui-selected': {
          background: 'white',
          border: '1px solid white',
          borderColor: 'white #e8eef5',
          borderBottom: '1px solid #E3E8EE',
          borderRight: 'none',
        },
        '& .MuiTab-wrapper': {
          alignItems: 'baseline',
          fontFamily: 'Medium',
          fontSize: 15,
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
  },
  typography: {
    fontFamily: 'Regular',
    h1: {
      fontFamily: 'Medium',
      fontSize: 18,
      color: HighlightColor,
    },
    h2: {
      fontFamily: 'Medium',
      fontSize: 15,
      color: '#000',
    },
    h3: {
      fontFamily: 'Medium',
      fontSize: 15,
      color: HighlightColor,
    },

    subtitle1: {
      fontSize: 14,
      color: '#9a9a9d',
      lineHeight: '1.58',
    },
  },
  palette: {
    primary: {
      main: HighlightColor,
    },
    secondary: {
      main: '#FFFFFF',
    },
  },
});
