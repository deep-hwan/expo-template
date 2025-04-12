import {DimensionType} from '../_types/DimensionType';

const dimensionProps = (props: DimensionType) => {
  return {
    width: props?.width,
    minWidth: props?.maxWidth,
    maxWidth: props?.maxWidth,
    height: props?.height,
    maxHeight: props?.maxHeight,
    minHeight: props?.minHeight,
    zIndex: props?.zIndex,
  };
};

export {dimensionProps};
