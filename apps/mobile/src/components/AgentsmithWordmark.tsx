import type { ColorValue } from "react-native";
import Svg, { Path } from "react-native-svg";
import { withUniwind } from "uniwind";

const ThemedPath = withUniwind(Path);

/**
 * The AgentSmith brand glyph (Cloudsmith mark), matching the desktop sidebar.
 * Companion "AgentSmith" text is rendered by the surrounding layout, not this
 * component. Width derives from the square viewBox aspect ratio.
 */
export function AgentsmithWordmark(props: {
  readonly height: number;
  readonly color?: ColorValue;
  readonly colorClassName?: string;
}) {
  return (
    <Svg height={props.height} width={props.height} viewBox="150 150 390 390">
      <ThemedPath
        fillRule="evenodd"
        clipRule="evenodd"
        d="M500.5 325.48V360.035L361.833 498.257H327.167L188.5 360.035V325.48L327.167 187.257H361.833L500.5 325.48ZM344.498 423.889C389.447 423.889 425.886 387.567 425.886 342.762C425.886 297.957 389.447 261.635 344.498 261.635C299.549 261.635 263.11 297.957 263.11 342.762C263.11 387.567 299.549 423.889 344.498 423.889Z"
        color={props.color}
        colorClassName={props.colorClassName}
        fill="currentColor"
      />
    </Svg>
  );
}
