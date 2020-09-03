import { createMuiTheme } from '@material-ui/core';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const baseTheme = {
  palette,
  typography,
  overrides,
};

// eslint-disable-next-line import/prefer-default-export
export const theme = createMuiTheme(baseTheme);
