import React from 'react';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/fonts/glyph/selection.json';

const Icon = createIconSetFromIcoMoon(icoMoonConfig);

function icon({ iconClass, iconStyle }) {
  return (
    <Icon
      style={iconStyle}
      name={iconClass} />
  );
}

export default { icon };
