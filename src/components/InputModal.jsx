import { useEffect, useRef, useState } from 'react'
import Button from './Button'

export default function InputModal({
    open,
    title,
    description,
    defaultValue = '',
    placeholder = '',
    confirmText = '확인',
    onConfirm,
    onClose,
}) {
    const dialogRef = useRef(null)
    const [value, setValue] = useState(defaultValue)

    useEffect(() => {
        const dialog = dialogRef.current

        if (!open) {
            if (dialog?.open) dialog.close()
            return
        }

        setValue(defaultValue)
        dialog.showModal()
    }, [open, defaultValue])

    const handleSubmit = (event) => {
        event.preventDefault()

        const trimmedValue = value.trim()

        if (!trimmedValue) return

        onConfirm(trimmedValue)
    }

    return (
        <dialog
            ref={dialogRef}
            className="m-auto w-[420px] max-w-[calc(100vw-40px)] border border-frame bg-white p-[26px] text-ink backdrop:bg-[rgba(23,18,14,.45)]"
            aria-labelledby="input-modal-title"
            onClose={onClose}
        >
            <div className="flex items-start justify-between gap-[16px]">
                <div>
                    <h2
                        id="input-modal-title"
                        className="m-0 text-[17px] font-semibold"
                    >
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-[7px] mb-0 text-[12px] leading-[19px] text-ink/55">
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

            <form className="mt-[20px]" onSubmit={handleSubmit}>
                <input
                    className="h-[44px] w-full rounded-none border border-[#dcd3c5] bg-[#fdfbf7] px-[13px] text-[12.5px] text-ink outline-none focus:border-clay"
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => setValue(event.target.value)}
                    autoFocus
                />

                <div className="mt-[18px] flex justify-end gap-[9px]">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        취소
                    </Button>

                    <Button
                        type="submit"
                        disabled={!value.trim()}
                    >
                        {confirmText}
                    </Button>
                </div>
            </form>
        </dialog>
    )
}