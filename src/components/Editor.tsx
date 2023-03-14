import { useRef, useState, useEffect, useCallback } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { vim } from '@replit/codemirror-vim'
import { marked } from 'marked'
import { Bars3Icon } from '@heroicons/react/24/solid'

import { EDITOR_LAYOUT, FILE_SAVED_ID } from '@/state/constants'
import { openFileFromLocalSystem, saveFileToLocalSystem } from '@/state/data/filesystem'
import DropdownMenu from './DropdownMenu'
import useOnClickOutside from '@/hooks/useOnClickOutside'
import { HamburgerMenuIcon } from './icons'
import { GithubService } from '@/service/GithubService'
import GithubFormModal from './GithubFormModal'

const Help = ({ onClick }: { onClick: any }) => {
  return (
    <div className="editor-help" onClick={onClick}>
      <div className="prompt">
        <p>
          <strong>VIM Cheat Sheet</strong>
        </p>
        <ul>
          <li>
            <kbd>i</kbd> - insert mode
          </li>
          <li>
            <kbd>ESC</kbd> - visual mode
          </li>
          <li>
            <kbd>h</kbd> - move cursor left
          </li>
          <li>
            <kbd>j</kbd> - move cursor down
          </li>
          <li>
            <kbd>k</kbd> - move cursor up
          </li>
          <li>
            <kbd>l</kbd> - move cursor right
          </li>
        </ul>
      </div>
    </div>
  )
}

const Editor = () => {
  const $editorRef = useRef<ReactCodeMirrorRef>(null)
  const $menuRef = useRef<HTMLDivElement | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [text, setText] = useState<string>(() => {
    return localStorage.getItem(FILE_SAVED_ID) ?? ''
  })
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [edit, setEdit] = useState<number>(EDITOR_LAYOUT.SPLIT_EDITOR_PREVIEW)
  const [openMenu, setOpenMenu] = useState<boolean>(false)
  const [modalIsOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const output = marked.parse(text)
    setPreview(output)
    localStorage.setItem(FILE_SAVED_ID, text)
  }, [text])

  useEffect(() => {
    const savedText = localStorage.getItem(FILE_SAVED_ID)
    if (savedText !== null) {
      setText(savedText)
    }
  }, [])

  const onChange = useCallback((value: string) => {
    setText(value)
  }, [])
  const onHide = () => {
    setShowHelp(false)
  }

  const openFile = async () => {
    try {
      setOpenMenu(false)
      const text = await openFileFromLocalSystem()
      setText(text ?? '')
    } catch (err) {
      console.error(err)
    }
  }
  const saveFile = async () => {
    try {
      setOpenMenu(false)
      await saveFileToLocalSystem(text)
    } catch (err) {
      console.error(err)
    }
  }

  const saveToGithub = async () => {
    try {
      setOpenMenu(false)
      setIsOpen(true)
    } catch (err) {
      console.error(err)
    }
  }

  useOnClickOutside($menuRef, () => {
    setOpenMenu(false)
  })
  const onSaveTextToGithub = async (data: GithubFormData) => {
    try {
      const savedUser = localStorage.getItem('github-user')
      if (!savedUser) {
        throw new Error('Not found user')
      }
      const githubUser = JSON.parse(savedUser)
      const githubService = new GithubService(data.accessToken, githubUser.login, githubUser.email)
      await githubService.saveFile(data.repository, data.saveAs, text)
      setIsOpen(false)
      localStorage.setItem('github-access-token', data.accessToken)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div id="editor">
      {modalIsOpen ? (
        <GithubFormModal
          setIsOpen={(isOpen) => setIsOpen(isOpen)}
          onSaveData={onSaveTextToGithub}
        />
      ) : null}

      <div className="editor-toolbar">
        <div className="left-toolbar">
          <DropdownMenu
            ref={$menuRef}
            open={openMenu}
            trigger={
              <button onClick={() => setOpenMenu(!openMenu)}>
                <Bars3Icon className="h-6 w-6" />
              </button>
            }
            menu={[
              <div className="menu-item" key={0} onClick={openFile}>
                Open...
              </div>,
              <div className="menu-item" key={1} onClick={saveFile}>
                Save as...
              </div>,
              <div className="menu-item" key={2} onClick={saveToGithub}>
                Save file to Github
              </div>,
            ]}
          />
        </div>
        <div className="right-toolbar">
          <button
            className="github mr-3"
            onClick={() => window.open('https://github.com/congdv/notemd.app', '_blank')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </button>
          <button className="preview-mode" type="button" onClick={() => setEdit((edit + 1) % 3)}>
            <svg width="20" height="20" viewBox="0 0 520 520">
              <polygon
                fill="currentColor"
                points="0 71.293 0 122 179 122 179 397 0 397 0 449.707 232 449.413 232 71.293"
              />
              <polygon
                fill="currentColor"
                points="289 71.293 520 71.293 520 122 341 123 341 396 520 396 520 449.707 289 449.413"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="editor-content">
        <div
          className={`editor-area ${edit === EDITOR_LAYOUT.FULL_EDITOR && 'full-width'} ${
            edit === EDITOR_LAYOUT.FULL_PREVIEW && 'disappear'
          }`}
        >
          <CodeMirror
            ref={$editorRef}
            value={text}
            height="100%"
            basicSetup={{ defaultKeymap: false }}
            extensions={[vim()]}
            autoFocus={true}
            onChange={onChange}
            style={{
              height: '100%',
            }}
          />
        </div>
        <div
          className={`editor-preview  ${edit === EDITOR_LAYOUT.FULL_PREVIEW && 'full-width'} ${
            edit === EDITOR_LAYOUT.FULL_EDITOR && 'disappear'
          }`}
        >
          <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: preview }}></div>
        </div>
      </div>
      {showHelp ? (
        <Help onClick={() => setShowHelp(false)} />
      ) : (
        <div className="editor-help" onClick={() => setShowHelp(true)}>
          Help?
        </div>
      )}
    </div>
  )
}

export default Editor
