import { Button, ButtonLink } from '@/components';
import * as Dialog from '@radix-ui/react-dialog';
import { forwardRef, useEffect, useState } from 'react';
import { MainLayout, MainLayoutProps } from '../main-layout';
import {
  StyledPromptContent,
  StyledPromptCTA,
  StyledPromptOverlay,
  StyledPromptPortal,
  StyledPromptTitle,
} from './restricted-layout.styles';

export const RestrictedLayout = forwardRef<HTMLElement, MainLayoutProps>(
  (props, ref) => {
    const [isAccepted, setIsAccepted] = useState(false);
    const [customLocalStorage, setCustomLocalStorage] = useState<Storage>();

    useEffect(() => {
      const isAcceptedReq = localStorage.getItem('isAccepted')
        ? (JSON.parse(localStorage.getItem('isAccepted') as string) as boolean)
        : false;

      setCustomLocalStorage(localStorage);
      setIsAccepted(isAcceptedReq);
    }, []);

    if (!customLocalStorage) return null;

    return (
      <>
        <Dialog.Root defaultOpen={!isAccepted}>
          <StyledPromptPortal>
            <StyledPromptOverlay />
            <StyledPromptContent
              onInteractOutside={(event) => event.preventDefault()}
            >
              <StyledPromptTitle>
                Are you sure to open this page?
              </StyledPromptTitle>
              <Dialog.Description>
                Any feelings of disapproval, dislike, and other feelings are not
                my responsibility if you choose to click <code>Yes!</code> :p
              </Dialog.Description>
              <StyledPromptCTA>
                <Dialog.Close
                  asChild
                  onClick={() => localStorage.setItem('isAccepted', 'true')}
                >
                  <Button size="sm">Yes!</Button>
                </Dialog.Close>
                <ButtonLink href="/" size="sm" outlined>
                  Nope!
                </ButtonLink>
              </StyledPromptCTA>
            </StyledPromptContent>
          </StyledPromptPortal>
        </Dialog.Root>
        <MainLayout ref={ref} {...props} />
      </>
    );
  },
);
