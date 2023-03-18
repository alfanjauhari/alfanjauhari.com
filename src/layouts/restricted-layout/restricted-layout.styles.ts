import { styled } from '@/theme';
import * as Dialog from '@radix-ui/react-dialog';

export const StyledPromptPortal = styled(Dialog.Portal, {
  zIndex: 999,
});

export const StyledPromptOverlay = styled(Dialog.Overlay, {
  backdropFilter: 'blur(20px)',
  position: 'fixed',
  inset: 0,
});

export const StyledPromptContent = styled(Dialog.Content, {
  backgroundColor: 'white',
  borderRadius: '6px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '450px',
  maxHeight: '85vh',
  boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
  padding: 25,
  '&:focus': {
    outline: 'none',
  },
});

export const StyledPromptTitle = styled(Dialog.Title, {
  fontWeight: 600,
  fontSize: '24px',
});

export const StyledPromptCTA = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '$2',
  mt: '$2',
});
