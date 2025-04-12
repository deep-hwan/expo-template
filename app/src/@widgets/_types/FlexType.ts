export type FlexType = {
  display?: "none" | "flex" | undefined;
  direction?: "row" | "column" | "row-reverse" | "column-reverse" | undefined;
  flex?: number | undefined;
  flexWrap?: "wrap" | "nowrap" | "wrap-reverse" | undefined;
  gap?: number;
  alignContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | undefined;
  align?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "stretch"
    | "baseline"
    | undefined;
  justify?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | undefined;
};
