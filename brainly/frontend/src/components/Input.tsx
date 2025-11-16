import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    placeholder: string;
    reference?: any;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ placeholder, reference, ...props }, ref) => {
        return (
            <input
                ref={ref || reference}
                placeholder={placeholder}
                type="text"
                className="px-4 py-2 border rounded m-2"
                {...props}
            />
        );
    }
);