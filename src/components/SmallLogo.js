export default function SmallLogo() {
  return (
    <svg width="100" height="32" viewBox="0 0 100 32">
    <text
      x="50"
      y="22"
      textAnchor="middle"
      fill="white"
      style={{
        fontSize: '24px',
        fontWeight: '800',
        fontFamily: 'Arial, sans-serif',
        letterSpacing: '1px'
      }}
    >
      ESCO
    </text>
    <rect 
      x="15" 
      y="25" 
      width="70" 
      height="2" 
      fill="#2563EB"
      rx="1"
    />
  </svg>
  );
}