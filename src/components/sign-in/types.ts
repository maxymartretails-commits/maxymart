export type SigninModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onGoogleSignIn?: () => void;
  loadingGoogle?: boolean;
};