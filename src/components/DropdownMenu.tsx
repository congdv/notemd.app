import { forwardRef, useState } from 'react'

// eslint-disable-next-line react/display-name
const DropdownMenu = forwardRef(
  ({ open, trigger, menu }: { open: boolean; trigger: any; menu: any }, ref: any) => {
    return (
      <div className="dropdown" ref={ref}>
        {trigger}
        {open ? <div className="menu">{menu.map((menuItem: any) => menuItem)}</div> : null}
      </div>
    )
  }
)

export default DropdownMenu
