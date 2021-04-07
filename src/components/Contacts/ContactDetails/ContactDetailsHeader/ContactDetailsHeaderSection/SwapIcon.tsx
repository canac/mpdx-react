import { styled, SvgIcon } from '@material-ui/core';

import React, { ReactElement } from 'react';
import theme from '../../../../../theme';

const SwapIconSvg = styled(SvgIcon)(({}) => ({
  display: 'inline-block',
  width: '22px',
  height: '22px',
  color: theme.palette.text.secondary,
  margin: '1px',
}));

export const SwapIcon = (): ReactElement => (
  <SwapIconSvg>
    <path d="M20.7097 7.70993C21.9597 6.45993 21.3897 4.99993 20.7097 4.28993L17.7097 1.28993C16.4497 0.039929 14.9997 0.609929 14.2897 1.28993L12.5897 2.99993H9.99969C8.09969 2.99993 6.99968 3.99993 6.43968 5.14993L1.99968 9.58993V13.5899L1.28968 14.2899C0.0396849 15.5499 0.609685 16.9999 1.28968 17.7099L4.28968 20.7099C4.82968 21.2499 5.40968 21.4499 5.95968 21.4499C6.66968 21.4499 7.31968 21.0999 7.70968 20.7099L10.4097 17.9999H13.9997C15.6997 17.9999 16.5597 16.9399 16.8697 15.8999C17.9997 15.5999 18.6197 14.7399 18.8697 13.8999C20.4197 13.4999 20.9997 12.0299 20.9997 10.9999V7.99993H20.4097L20.7097 7.70993ZM18.9997 10.9999C18.9997 11.4499 18.8097 11.9999 17.9997 11.9999H16.9997V12.9999C16.9997 13.4499 16.8097 13.9999 15.9997 13.9999H14.9997V14.9999C14.9997 15.4499 14.8097 15.9999 13.9997 15.9999H9.58969L6.30968 19.2799C5.99968 19.5699 5.81968 19.3999 5.70968 19.2899L2.71968 16.3099C2.42968 15.9999 2.59968 15.8199 2.70968 15.7099L3.99968 14.4099V10.4099L5.99968 8.40993V9.99993C5.99968 11.2099 6.79969 12.9999 8.99969 12.9999C11.1997 12.9999 11.9997 11.2099 11.9997 9.99993H18.9997V10.9999ZM19.2897 6.28993L17.5897 7.99993H9.99969V9.99993C9.99969 10.4499 9.80969 10.9999 8.99969 10.9999C8.18969 10.9999 7.99968 10.4499 7.99968 9.99993V6.99993C7.99968 6.53993 8.16969 4.99993 9.99969 4.99993H13.4097L15.6897 2.71993C15.9997 2.42993 16.1797 2.59993 16.2897 2.70993L19.2797 5.68993C19.5697 5.99993 19.3997 6.17993 19.2897 6.28993Z" />
  </SwapIconSvg>
);
