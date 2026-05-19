import { useState } from 'react';
import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

type Viewport = 'mobile' | 'tablet' | 'desktop';

const VIEWPORT_CONFIG: { id: Viewport; label: string; width: string }[] = [
  { id: 'mobile', label: '모바일', width: '375px' },
  { id: 'tablet', label: '태블릿', width: '768px' },
  { id: 'desktop', label: '데스크탑', width: '100%' },
];

interface LivePreviewProps {
  code: string;
}

export function LivePreview({ code }: LivePreviewProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const maxWidth = VIEWPORT_CONFIG.find((v) => v.id === viewport)?.width ?? '100%';

  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>미리보기</h3>
        <div className="viewport-switcher">
          {VIEWPORT_CONFIG.map(({ id, label }) => (
            <button
              key={id}
              className={`btn-viewport ${viewport === id ? 'btn-viewport--active' : ''}`}
              onClick={() => setViewport(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="preview-content">
        <LiveProvider code={code} noInline>
          <div className="preview-render" style={{ maxWidth, margin: '0 auto' }}>
            <ReactLivePreview />
          </div>
          <LiveError className="preview-error" />
        </LiveProvider>
      </div>
    </div>
  );
}
