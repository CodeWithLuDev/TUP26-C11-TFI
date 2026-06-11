interface FlagIconProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
}

const sizeMap = { sm: 'w-5 h-5', md: 'w-7 h-7', lg: 'w-10 h-10' };

export function FlagIcon({ countryCode, size = 'md', alt }: FlagIconProps) {
  return (
    <img
      src={`https://flagcdn.com/24x18/${countryCode}.png`}
      srcSet={`https://flagcdn.com/48x36/${countryCode}.png 2x`}
      alt={alt ?? countryCode}
      className={`${sizeMap[size]} rounded-sm object-cover inline-block`}
      loading="lazy"
    />
  );
}
