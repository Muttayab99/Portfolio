import { useEffect } from 'react';
import { profile } from '@/content/profile';

const SUFFIX = ` | ${profile.name}`;

/** Per-route <title> and meta description for a client-rendered SPA. */
export function useDocumentMeta(title: string | undefined, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = meta?.content;

    document.title = title ? `${title}${SUFFIX}` : `${profile.name} | ${profile.role}`;
    if (description && meta) meta.content = description;

    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== undefined) meta.content = prevDesc;
    };
  }, [title, description]);
}
