import { tsx } from '@arcgis/core/widgets/support/widget';

interface iconJSON {
  path: string;
}

export function calciteSVG(icon: string | iconJSON, size: number, svgClass?: string): tsx.JSX.Element {
  const path = typeof icon === 'string' ? icon : icon.path;
  return (
    <svg
      style={`width:${size}px;height:${size}px;`}
      aria-hidden="true"
      focusable="false"
      class={svgClass || ''}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${size} ${size}`}
    >
      <path fill="currentColor" d={path}></path>
    </svg>
  );
}
