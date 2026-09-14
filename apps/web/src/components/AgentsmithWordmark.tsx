import type { SVGProps } from "react";

/**
 * The AgentSmith brand glyph (Cloudsmith mark). Companion "AgentSmith" text is
 * rendered by the surrounding layout, not this component.
 */
export function AgentsmithWordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="150 150 390 390" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M500.5 325.48V360.035L361.833 498.257H327.167L188.5 360.035V325.48L327.167 187.257H361.833L500.5 325.48ZM344.498 423.889C389.447 423.889 425.886 387.567 425.886 342.762C425.886 297.957 389.447 261.635 344.498 261.635C299.549 261.635 263.11 297.957 263.11 342.762C263.11 387.567 299.549 423.889 344.498 423.889Z"
        fill="currentColor"
      />
    </svg>
  );
}
