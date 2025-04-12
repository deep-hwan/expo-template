export type BorderType = {
  border?: {
    solid?: number | undefined;
    position?: 'all' | 'left' | 'right' | 'top' | 'bottom' | undefined;
    color?: string | undefined;
  };

  borderRadius?: number;
  borderRadiusPosition?: {
    topStart?: number;
    topEnd?: number;
    bottomStart?: number;
    bottomEnd?: number;
  };
};
