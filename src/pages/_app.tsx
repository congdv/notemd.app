import '@/styles/globals.css'
import { GA_TRACKING_ID } from '@/utils/gtag'
import useGtag from '@/utils/useGtag'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  useGtag()
  return (
    <>
      <Head>
        <title>notemd.app</title>
        <link rel="icon" href="/favicon.ico" />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
          `,
          }}
        />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
