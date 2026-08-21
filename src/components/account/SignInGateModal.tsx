import { useAuth } from '../../context/useAuth'
import { Icon } from '../ui/Icon'

interface SignInGateModalProps {
  open: boolean
  message: string
  onClose: () => void
}

/** Blocks a write action (highlighting, adding a note) behind sign-in. */
export function SignInGateModal({ open, message, onClose }: SignInGateModalProps) {
  const { signInWithGoogle } = useAuth()
  if (!open) return null

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal sign-in-gate-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Sign in required"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 className="modal-title">Sign in required</h2>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>

        <p className="sign-in-gate-message">{message}</p>

        <footer className="modal-footer">
          <span className="modal-footer-spacer" />
          <button type="button" className="button ghost" onClick={onClose}>
            Not now
          </button>
          <button
            type="button"
            className="button primary"
            onClick={() => {
              void signInWithGoogle()
            }}
          >
            Continue with Google
          </button>
        </footer>
      </div>
    </div>
  )
}
