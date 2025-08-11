import { useCallback, useState } from 'react'

export function useSaveAlert() {
  const [showAlert, setShowAlert] = useState(false)

  const show = useCallback(() => setShowAlert(true), [])
  const hide = useCallback(() => setShowAlert(false), [])

  return {
    showAlert,
    show,
    hide,
  }
}
