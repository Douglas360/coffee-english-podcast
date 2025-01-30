import { useEffect } from 'react';

interface GoogleAdsenseProps {
  slot: string;
  style?: React.CSSProperties;
  format?: 'auto' | 'fluid';
  responsive?: boolean;
  className?: string;
}

export const GoogleAdsense = ({ 
  slot, 
  style = {}, 
  format = 'auto',
  responsive = true,
  className = ''
}: GoogleAdsenseProps) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error loading Google Adsense:', err);
    }
  }, []);

  return (
    <div className={`google-adsense ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};