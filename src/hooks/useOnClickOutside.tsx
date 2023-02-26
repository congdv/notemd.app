import { RefObject, useEffect } from 'react'

const useOnClickOutside = (ref: RefObject<HTMLElement>, cb: (event: MouseEvent) => void) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current) {
        return
      }

      if (
        event.target instanceof Element &&
        (ref.current.contains(event.target) || !document.body.contains(event.target))
      ) {
        return
      }

      cb(event)
    }
    document.addEventListener('pointerdown', listener, false)

    return () => {
      document.removeEventListener('pointerdown', listener)
    }
  }, [ref, cb])
}
export default useOnClickOutside
