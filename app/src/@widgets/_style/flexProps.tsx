import { FlexType } from "../_types/FlexType";

const flexProps = (props: FlexType) => {
  return {
    display: props?.display ?? "flex",
    flex: props?.flex,
    flexDirection: props?.direction,
    flexWrap: props?.flexWrap,
    gap: props?.gap,
    alignItems: props?.align ?? "flex-start",
    justifyContent: props?.justify,
    alignContent: props?.alignContent,
  };
};

export { flexProps };
