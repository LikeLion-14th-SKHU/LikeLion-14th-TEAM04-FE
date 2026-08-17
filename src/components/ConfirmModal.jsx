import { useEffect, useRef } from 'react'
import Button from './Button'

export default function ConfirmModal({
    open,
    title,
    description,
    confirmText = '확인',
    cancelText = '취소',
    onConfirm,
    onClose,
}) {
    const dialogRef = useRef(null)

    useEffect(() => {
        const dialog = dialogRef.current

        if (!open) {
            if (dialog?.open) dialog.close()
            return
        }

        if (!dialog.open) {
            dialog.showModal()
        }
    }, [open])

    return (
        <dialog
            ref={dialogRef}
            className="m-auto w-[420px] max-w-[calc(100vw-40px)] border border-frame bg-white p-[26px] text-ink backdrop:bg-[rgba(23,18,14,.45)]"
            aria-labelledby="confirm-modal-title"
            onClose={onClose}
        >
            <div className="flex items-start justify-between gap-[16px]">
                <div className="min-w-0">
                    <h2
                        id="confirm-modal-title"
                        className="m-0 text-[17px] font-semibold"
                    >
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-[9px] mb-0 text-[12px] leading-[20px] break-keep text-ink/55">
                            {description}
                        </p>
                    )}
                </div>

                <button
                    className="flex size-[22px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-ink/50 hover:text-ink"
                    type="button"
                    onClick={onClose}
                    aria-label="닫기"
                >
                    <svg
                        className="size-[13px]"
                        viewBox="0 0 13 13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        aria-hidden="true"
                    >
                        <path d="M1 1 12 12M12 1 1 12" />
                    </svg>
                </button>
            </div>

            <div className="mt-[24px] flex justify-end gap-[9px]">

                {/* cancelText가 있을 때만 취소 버튼 표시 */}
                {cancelText && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                )}

                <Button
                    type="button"
                    onClick={onConfirm}
                >
                    {confirmText}
                </Button>
            </div>
        </dialog>
    )
}