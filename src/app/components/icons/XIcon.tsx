import xLogo from 'figma:asset/eee4e48009cad34dbf8876faa3b8b7f7502a8f28.png';

interface XIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export function XIcon({ className = "w-5 h-5", style }: XIconProps) {
  return (
    <img 
      src={xLogo} 
      alt="X" 
      className={className}
      style={{
        ...style,
        filter: style?.color === '#E3107A' ? 'brightness(0) saturate(100%) invert(21%) sepia(93%) saturate(4447%) hue-rotate(324deg) brightness(91%) contrast(93%)' : 'brightness(0) saturate(100%) invert(100%)'
      }}
    />
  );
}