import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
    return {
      githubUrl: "https://github.com/bunnativekit/bunnativekit",
      links: [
        { url: '/docs', text: 'Docs' },
        { url: '/github', text: 'GitHub' },
      ],
      nav: {
        title: 'BunNativeKit',
      },
    };
}
