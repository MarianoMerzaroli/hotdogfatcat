import Script from 'next/script'

const SILKTIDE_CSS = '/silktide-consent-manager.css'
const SILKTIDE_JS = '/silktide-consent-manager.js'

function escapeForJsString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n')
}

function getConsentDefaultScript(): string {
  return `(function(){
  var n=typeof localStorage!=='undefined'&&localStorage.getItem('silktideCookieChoice_necessary')==='true';
  var a=typeof localStorage!=='undefined'&&localStorage.getItem('silktideCookieChoice_analytics')==='true';
  var m=typeof localStorage!=='undefined'&&localStorage.getItem('silktideCookieChoice_advertising')==='true';
  if(typeof gtag==='function'){
    gtag('consent','default',{
      analytics_storage:a?'granted':'denied',
      ad_storage:m?'granted':'denied',
      ad_user_data:m?'granted':'denied',
      ad_personalization:m?'granted':'denied',
      functionality_storage:n?'granted':'denied',
      security_storage:n?'granted':'denied',
      wait_for_update:500
    });
  }
})();`
}

function getSilktideConfigScript(cookiePolicyUrl: string): string {
  const u = escapeForJsString(cookiePolicyUrl)
  return `(function(){
  var u='${u}';
  function run(){
    if(typeof silktideConsentManager!=='undefined'){
      var config={
        position:{banner:'bottomRight',cookieIcon:'bottomLeft'},
        background:{showBackground:true},
        consentTypes:[
          {id:'necessary',name:'Necessary',description:'<p>Required for the site to function.</p>',required:true},
          {id:'analytics',name:'Analytics',description:'<p>Help us understand how you use the site.</p>',required:false,defaultValue:false,onAccept:function(){if(typeof gtag==='function')gtag('consent','update',{analytics_storage:'granted'});},onReject:function(){if(typeof gtag==='function')gtag('consent','update',{analytics_storage:'denied'});}},
          {id:'advertising',name:'Advertising',description:'<p>Used for ads and personalization.</p>',required:false,defaultValue:false,onAccept:function(){if(typeof gtag==='function')gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});},onReject:function(){if(typeof gtag==='function')gtag('consent','update',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});}}
        ],
        text:{
          banner:{description:'<p>We use cookies to improve your experience. <a href=\"'+u+'\" target=\"_blank\">Cookie policy</a>.</p>',acceptAllButtonText:'Accept all',rejectNonEssentialButtonText:'Reject non-essential',preferencesButtonText:'Preferences'},
          preferences:{title:'Cookie preferences',description:'<p>Choose which cookies you allow.</p>',creditLinkText:'Powered by Silktide Consent Manager'}
        }
      };
      if(typeof silktideConsentManager!=='undefined'&&silktideConsentManager.init){
        silktideConsentManager.init(config);
      }
      return;
    }
    setTimeout(run,50);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);
  else run();
})();`
}

export function ConsentAndAnalyticsHead() {
  const cookiePolicyUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_COOKIE_POLICY_URL) || '/privacy/'
  const gaId =
    typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_GA_MEASUREMENT_ID : undefined

  return (
    <>
      <link rel="stylesheet" href={SILKTIDE_CSS} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Customize Silktide colors to match website palette */
            #stcm-wrapper {
              --primaryColor: #a9422d; /* rust - for buttons and links */
              --backgroundColor: #f8e9d4; /* cream - for banner background */
              --textColor: #2b1c16; /* dark - for text */
              --iconColor: #f8e9d4; /* cream - for icon text */
              --iconBackgroundColor: #a9422d; /* rust - for icon background */
              --backdropBackgroundColor: rgba(26, 15, 11, 0.4); /* ink with opacity - for backdrop */
              --backdropBackgroundBlur: 4px;
            }
            /* Ensure text is readable on cream background */
            #stcm-banner p,
            #stcm-modal p {
              color: var(--textColor);
            }
            /* Style toggle switches to match theme */
            #stcm-modal .stcm-toggle-track {
              background: #ead1b0; /* sand - for toggle track */
            }
            #stcm-modal .stcm-toggle-thumb {
              background: var(--primaryColor); /* rust - for toggle thumb when on */
            }
            #stcm-modal .stcm-toggle input:checked + .stcm-toggle-track {
              background: var(--primaryColor);
            }
          `,
        }}
      />
      {/* Google Analytics gtag.js - matching Google's exact format for detection */}
      {gaId && (
        <>
          {/* Load gtag.js script with async attribute (hoisted to head by Next.js) */}
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="beforeInteractive"
          />
          {/* Combined initialization, consent mode, and config (executes in order) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${getConsentDefaultScript()}
                gtag('config', '${gaId.replace(/'/g, "\\'")}');
              `,
            }}
          />
        </>
      )}
      {!gaId && (
        <script
          dangerouslySetInnerHTML={{ __html: getConsentDefaultScript() }}
        />
      )}
      <script src={SILKTIDE_JS} />
      <script
        dangerouslySetInnerHTML={{ __html: getSilktideConfigScript(cookiePolicyUrl) }}
      />
    </>
  )
}

export function ConsentAndAnalyticsBody() {
  // Google Analytics is now loaded in the head, so this component is no longer needed
  // Keeping it for potential future use or other body scripts
  return null
}
