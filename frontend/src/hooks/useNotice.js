import { useContext } from 'react'
import noticeContext from '../context/contextValue'

export default function useNotice() {
  const context = useContext(noticeContext)
  if (!context) throw new Error('useNotice must be used inside NoticeProvider')
  return context
}
