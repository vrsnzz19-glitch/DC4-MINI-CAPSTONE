import { useCallback, useState } from 'react'
import noticeContext from './contextValue'

export function NoticeProvider({ children }) {
  const [notice, setNotice] = useState('')
  const flash = useCallback((message) => {
    setNotice(message)
    window.setTimeout(() => setNotice((current) => current === message ? '' : current), 2600)
  }, [])

  return <noticeContext.Provider value={{ notice, flash }}>{children}</noticeContext.Provider>
}
