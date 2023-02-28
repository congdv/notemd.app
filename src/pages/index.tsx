import dynamic from 'next/dynamic'
import Head from 'next/head'

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false }) as any

export default function Home() {
  return (
    <>
      <Head>
        <title>notemd.app</title>
      </Head>
      <Editor />
    </>
  )
}
