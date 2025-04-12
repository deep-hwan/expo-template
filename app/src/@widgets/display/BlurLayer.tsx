import {memo} from 'react';
import {View} from 'react-native';

const BlurLayer = memo(({zIndex}: {zIndex?: number}) => {
  return (
    <View
      style={{
        zIndex: zIndex ?? 9900,
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.35)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    />
  );
});

export default BlurLayer;
