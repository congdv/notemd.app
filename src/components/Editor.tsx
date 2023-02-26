import { useRef, useState, useEffect, useCallback } from 'react'
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror'
import { vim } from '@replit/codemirror-vim'
import { marked } from 'marked'

import { EDITOR_LAYOUT, FILE_SAVED_ID } from '@/state/constants'
import { openFileFromLocalSystem, saveFileToLocalSystem } from '@/state/data/filesystem'
import DropdownMenu from './DropdownMenu'
import useOnClickOutside from '@/hooks/useOnClickOutside'
import { HamburgerMenuIcon } from './Icons'

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
  useOnClickOutside($menuRef, () => {
    setOpenMenu(false)
  })
  return (
    <div id="editor">
      <div className="editor-toolbar">
        <div className="left-toolbar">
          <DropdownMenu
            ref={$menuRef}
            open={openMenu}
            trigger={
              <div className="menu-trigger" onClick={() => setOpenMenu(!openMenu)}>
                {HamburgerMenuIcon}
              </div>
            }
            menu={[
              <div className="menu-item" key={0} onClick={openFile}>
                Open...
              </div>,
              <div className="menu-item" key={1} onClick={saveFile}>
                Save as...
              </div>,
            ]}
          />
        </div>
        <div className="right-toolbar">
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
          className={`editor-preview ${edit === EDITOR_LAYOUT.FULL_PREVIEW && 'full-width'} ${
            edit === EDITOR_LAYOUT.FULL_EDITOR && 'disappear'
          }`}
          dangerouslySetInnerHTML={{ __html: preview }}
        ></div>
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
