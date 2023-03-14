import { GithubService } from '@/service/GithubService'
import { Octokit } from 'octokit'
import { useState } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#__next')

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
}

export default function Github() {
  const octokit = new Octokit({ auth: `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` })
  const [text, setText] = useState('')
  const [fileName, setFileName] = useState('')
  const [modalIsOpen, setIsOpen] = useState(false)
  let subtitle

  const onLogin = async () => {
    const {
      data: { login },
    } = await octokit.rest.users.getAuthenticated()
    console.log('Hello, %s', login)
    let repos = await octokit.request('GET /user/repos', { type: 'public', per_page: 80 })
    console.log('🚀 ~ file: github.tsx:12 ~ onLogin ~ repos:', repos)
    // Add new file
    const data = 'This is a test from notemd.app'

    const githubService = new GithubService(
      `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`,
      'congdv',
      'congdaovan94@gmail.com'
    )
    try {
      githubService.saveFile('emendly-data-development', fileName, text)
    } catch (error) {
      console.log(error)
    }
  }

  const onChange = (event: any) => {
    event.preventDefault()
    setText(event.target.value)
  }

  const onChangeFileName = (event: any) => {
    event.preventDefault()
    setFileName(event.target.value)
  }

  function openModal() {
    setIsOpen(true)
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle = {
      style: {
        color: '#f00',
      },
    }
  }

  function closeModal() {
    setIsOpen(false)
  }
  return (
    <div>
      Github test <button onClick={onLogin}>Login</button>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
    </div>
  )
}
