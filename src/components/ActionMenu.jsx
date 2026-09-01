import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical } from 'lucide-react';

export default function ActionMenu({
  groups = [],
  items = [],
  align = 'right',
  buttonClassName = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, placement: 'bottom' });

  // Normalisasi data: jika menggunakan prop `items`, bungkus jadi 1 group tanpa judul
  const normalizedGroups = groups.length > 0
    ? groups
    : items.length > 0
    ? [{ items }]
    : [];

  // Filter out hidden items & empty groups
  const activeGroups = normalizedGroups
    .map((g) => ({
      ...g,
      items: (g.items || []).filter((item) => !item.hidden),
    }))
    .filter((g) => g.items.length > 0);

  // Kalkulasi posisi menu mengambang (Floating UI via Portal)
  const updateCoords = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 192; // w-48 = 12rem = 192px
    const estimatedHeight = 220;
    const gap = 6;

    // Cek apakah ruang di bawah tombol cukup, jika tidak maka flip ke atas
    const spaceBelow = window.innerHeight - rect.bottom;
    const isTop = spaceBelow < estimatedHeight && rect.top > estimatedHeight;

    const top = isTop
      ? Math.max(8, rect.top - gap)
      : Math.min(window.innerHeight - 8, rect.bottom + gap);

    // Hitung posisi horizontal (clamp agar tidak keluar viewport)
    let left = align === 'left' ? rect.left : rect.right - menuWidth;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    if (left < 8) {
      left = 8;
    }

    setCoords({ top, left, placement: isTop ? 'top' : 'bottom' });
  }, [align]);

  // Update posisi saat terbuka & pasang event listener resize / scroll
  useEffect(() => {
    if (!isOpen) return;

    updateCoords();

    function handleClickOutside(event) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      updateCoords();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updateCoords]);

  if (activeGroups.length === 0) return null;

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white ${
          isOpen ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white' : ''
        } ${buttonClassName}`}
        title="Opsi Aksi"
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {/* DROPDOWN MENU VIA REACT PORTAL (Bebas dari clipping parent overflow) */}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: coords.placement === 'top' ? undefined : `${coords.top}px`,
              bottom: coords.placement === 'top' ? `${window.innerHeight - coords.top}px` : undefined,
              left: `${coords.left}px`,
              zIndex: 9999,
            }}
            className="w-48 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl transition-all animate-in fade-in zoom-in-95 dark:border-white/10 dark:bg-slate-900/95"
          >
            {activeGroups.map((group, gIdx) => (
              <div key={gIdx}>
                {gIdx > 0 && <div className="my-1 h-px bg-slate-100 dark:bg-white/10" />}
                {group.title && (
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {group.title}
                  </div>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const commonClass = `flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      item.isDanger
                        ? 'text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white'
                    } ${item.disabled ? 'opacity-40 pointer-events-none' : ''}`;

                    if (item.href) {
                      return (
                        <a
                          key={itemIdx}
                          href={item.href}
                          target={item.target || '_blank'}
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className={commonClass}
                        >
                          {Icon && <Icon className={`h-4 w-4 shrink-0 ${item.iconColor || ''}`} />}
                          <span className="truncate">{item.label}</span>
                        </a>
                      );
                    }

                    return (
                      <button
                        key={itemIdx}
                        type="button"
                        onClick={(e) => {
                          setIsOpen(false);
                          item.onClick?.(e);
                        }}
                        className={commonClass}
                      >
                        {Icon && <Icon className={`h-4 w-4 shrink-0 ${item.iconColor || ''}`} />}
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}
