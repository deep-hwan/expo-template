import React from 'react';
import {View} from 'react-native';
import {Spacing, Text} from '../display';

const InputContainer = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => {
  return (
    <View style={{width: '100%'}}>
      <Text size={9} color="#87878a">
        {label}
      </Text>

      <Spacing size={5} />

      {children}
    </View>
  );
};

export default InputContainer;
