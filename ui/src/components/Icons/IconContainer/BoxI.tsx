import { ComponentProps, ElementType, forwardRef, ReactElement, Ref } from "react";
import { CombineResponsiveValues } from "../../../Types/Providers/Config/CombineResponsiveValues";
import { createCssProps, cssPropsKeys, CssPropsSystem } from "../../../Types/Providers/Config/CSSPropsSystem";
import { BaseTheme } from "../../../Types/Providers/Types";
import { omit } from "../../../Utils/omit";

const DEFAULT_TAG = "div";

type OwnProps<E extends ElementType = ElementType> =
  CssPropsSystem & {
    /**
     * This is the tag that would be rendered in the DOM. The Box properties will be inferred based on the tag.
     */
    as?: E;

    /**
     * Label is a system prop that's used to change the class-name generator so it's easier to find nodes in the DOM when investigating
     */
    label?: string;
  };

export type BoxProps<E extends ElementType> = OwnProps<E> & Omit<ComponentProps<E>, keyof OwnProps>;

//@ts-ignore
export const Box: <E extends ElementType = typeof DEFAULT_TAG>(props: BoxProps<E>) => ReactElement | null = forwardRef(
  ({ label, ...props }: OwnProps, ref: Ref<Element>) => {
    const Element = props.as || DEFAULT_TAG;
    const clickable = "onClick" in props;
    const isSvg = Element === 'svg';

    let cssProps = {};
    if (!isSvg) {
      cssProps = {
        css: (theme: BaseTheme) => ({
          label: label ?? "box",
          ...CombineResponsiveValues(
            ...createCssProps(props, theme),
          ),
          ...(clickable && {
            cursor: "pointer",
            userSelect: "none",
          }),
        })
      };
    }

    return (
      <Element
        ref={ref}
        {...omit(props, ...cssPropsKeys)}
        {...cssProps}
        as={undefined}
      />
    );
  },
);
