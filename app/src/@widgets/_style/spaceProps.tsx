import { SpaceType } from "../_types/SpaceType";

const spaceProps = (props: { padding?: SpaceType; margin?: SpaceType }) => {
  return {
    padding: props?.padding?.all,
    paddingVertical: props?.padding?.vertical,
    paddingHorizontal: props?.padding?.horizontal,
    paddingLeft: props?.padding?.left,
    paddingRight: props?.padding?.right,
    paddingTop: props?.padding?.top,
    paddingBottom: props?.padding?.bottom,
    paddingStart: props?.padding?.start,
    paddingEnd: props?.padding?.end,

    //
    marginVertical: props?.margin?.vertical,
    marginHorizontal: props?.margin?.horizontal,
    marginLeft: props?.margin?.left,
    marginRight: props?.margin?.right,
    marginTop: props?.margin?.top,
    marginBottom: props?.margin?.bottom,
    marginStart: props?.margin?.start,
    marginEnd: props?.margin?.end,
  };
};

export { spaceProps };
