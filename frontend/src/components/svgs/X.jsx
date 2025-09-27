import React, { forwardRef } from 'react';
const XSvg = forwardRef(function ChirplyC_Filled(props, ref) {
  const { title = "Chirply logo", ...rest } = props;
  return (
    <svg
      ref={ref}
      role="img"
      aria-label={title}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>{title}</title>
      {/* A solid, stylized "C" made from two arcs (outer + inner) to create a thick crescent */}
      <path
        d="M17 6
           A7 7 0 1 0 17 18
           L13.6 18
           A4.6 4.6 0 1 1 13.6 6
           Z"
        fill="currentColor"
      />
    </svg>
  );
});
export default XSvg;