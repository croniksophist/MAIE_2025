declare module 'react-dom/client' {
    import { ReactNode } from 'react';
    export interface Root {
      render(children: ReactNode): void;
    }
    export function createRoot(container: Element | DocumentFragment): Root;
  }
  