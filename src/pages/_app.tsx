import '../styles/globals.css'
import { GA_TRACKING_ID } from '@/utils/gtag'
import useGtag from '@/utils/useGtag'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  useGtag()
  return (
    <>
      <Head>
        <title>notemd.app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
