/* ============================================================
   TOAST.JSX — TEMPORARY SUCCESS NOTIFICATION
   Displays a brief confirmation message at the bottom of the
   screen after an action (edit saved, pin deleted, etc.).
   Automatically disappears after 2.8 seconds.
   Props:
   - message : text to display inside the toast
   - onDone  : called when the timer expires, used by the parent
               to clear the toast state and unmount this component
   ============================================================ */

import { useEffect } from "react"

export default function Toast({ message, onDone }) {

  // START A TIMER ON MOUNT — CALLS onDone AFTER 2.8 SECONDS
  // THE CLEANUP FUNCTION CLEARS THE TIMER IF THE COMPONENT UNMOUNTS EARLY
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    // role="status" AND aria-live="polite" ANNOUNCE THE MESSAGE TO SCREEN READERS
    <div className="toast" role="status" aria-live="polite">
      <span className="toast-icon">✓</span>
      {message}
    </div>
  )
}