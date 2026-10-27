import Script from "next/script";
import { CONSENT_KEY, GA_ID, META_PIXEL_ID } from "../lib/analytics";

const GRANTED = `{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'}`;

/** Google Analytics 4 and the Meta Pixel. Renders nothing until their IDs are
 *  configured. Both start with consent denied (no cookies, no identifiers) and
 *  are granted only for visitors who accepted, now or on an earlier visit. */
export default function AnalyticsScripts() {
  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;
            gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
            try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){gtag('consent','update',${GRANTED})}}catch(e){}
            gtag('js',new Date());gtag('config','${GA_ID}');
          `}</Script>
        </>
      )}
      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          /* Meta holds everything queued after a "revoke" until a later "grant", and that grant cannot
             sit in the same startup queue. So a visitor who already accepted is simply not revoked. */
          var ok=false;try{ok=localStorage.getItem('${CONSENT_KEY}')==='granted'}catch(e){}
          if(!ok){fbq('consent','revoke')}
          fbq('init','${META_PIXEL_ID}');fbq('track','PageView');
        `}</Script>
      )}
    </>
  );
}
