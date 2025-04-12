import {DimensionValue} from 'react-native';

export type DimensionType = {
  width?: DimensionValue | undefined;
  height?: DimensionValue | undefined;
  maxHeight?: DimensionValue | undefined;
  maxWidth?: DimensionValue | undefined;
  minHeight?: DimensionValue | undefined;
  minWidth?: DimensionValue | undefined;
  zIndex?: number | undefined;
};
