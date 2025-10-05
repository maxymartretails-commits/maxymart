export type SignupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onGoogleSignIn?: () => void;
  loadingGoogle?: boolean;
};
