import { SpaceType } from "../_types/SpaceType";

const spaceProps = (props: { padding?: SpaceType; margin?: SpaceType }) => {
  const padding = props?.padding;
  const margin = props?.margin;

  // If all is defined, use it for all padding properties
  if (padding?.all !== undefined) {
    return {
      padding: padding.all,
      paddingVertical: padding.all,
      paddingHorizontal: padding.all,
      paddingLeft: padding.all,
      paddingRight: padding.all,
      paddingTop: padding.all,
      paddingBottom: padding.all,
      paddingStart: padding.all,
      paddingEnd: padding.all,

      ...(margin?.vertical !== undefined && {
        marginVertical: margin.vertical,
      }),
      ...(margin?.horizontal !== undefined && {
        marginHorizontal: margin.horizontal,
      }),
      ...(margin?.left !== undefined && {
        marginLeft: margin.left,
      }),
      ...(margin?.right !== undefined && {
        marginRight: margin.right,
      }),
      ...(margin?.top !== undefined && {
        marginTop: margin.top,
      }),
      ...(margin?.bottom !== undefined && {
        marginBottom: margin.bottom,
      }),
      ...(margin?.start !== undefined && {
        marginStart: margin.start,
      }),
      ...(margin?.end !== undefined && {
        marginEnd: margin.end,
      }),
    };
  }

  // If all is not defined, use individual padding properties
  return {
    ...(padding?.vertical !== undefined && {
      paddingVertical: padding.vertical,
    }),
    ...(padding?.horizontal !== undefined && {
      paddingHorizontal: padding.horizontal,
    }),
    ...(padding?.left !== undefined && {
      paddingLeft: padding.left,
    }),
    ...(padding?.right !== undefined && {
      paddingRight: padding.right,
    }),
    ...(padding?.top !== undefined && {
      paddingTop: padding.top,
    }),
    ...(padding?.bottom !== undefined && {
      paddingBottom: padding.bottom,
    }),
    ...(padding?.start !== undefined && {
      paddingStart: padding.start,
    }),
    ...(padding?.end !== undefined && {
      paddingEnd: padding.end,
    }),

    ...(margin?.vertical !== undefined && {
      marginVertical: margin.vertical,
    }),
    ...(margin?.horizontal !== undefined && {
      marginHorizontal: margin.horizontal,
    }),
    ...(margin?.left !== undefined && {
      marginLeft: margin.left,
    }),
    ...(margin?.right !== undefined && {
      marginRight: margin.right,
    }),
    ...(margin?.top !== undefined && {
      marginTop: margin.top,
    }),
    ...(margin?.bottom !== undefined && {
      marginBottom: margin.bottom,
    }),
    ...(margin?.start !== undefined && {
      marginStart: margin.start,
    }),
    ...(margin?.end !== undefined && {
      marginEnd: margin.end,
    }),
  };
};

export { spaceProps };
