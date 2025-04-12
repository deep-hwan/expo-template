import {ViewStyle} from 'react-native';
import {BorderType} from '../_types/BorderType';

const borderProps = (props: BorderType) => {
  const {
    border = {
      solid: props?.border?.solid,
      color: props?.border?.color ?? '#e2e2e2',
      position: props?.border?.position ?? 'all',
    },
    borderRadius,
    borderRadiusPosition,
  } = props;

  return {
    borderColor: border?.color ?? '#e2e2e2',
    borderWidth: border?.position === 'all' && border?.solid,
    borderTopWidth: border?.position === 'top' && border?.solid,
    borderBottomWidth: border?.position === 'bottom' && border?.solid,
    borderLeftWidth: border?.position === 'left' && border?.solid,
    borderRightWidth: border?.position === 'right' && border?.solid,
    borderRadius: borderRadius,
    borderTopStartRadius: borderRadiusPosition?.topStart,
    borderTopEndRadius: borderRadiusPosition?.topEnd,
    borderBottomStartRadius: borderRadiusPosition?.bottomStart,
    borderBottomEndRadius: borderRadiusPosition?.bottomEnd,
  } as ViewStyle;
};

export {borderProps};
