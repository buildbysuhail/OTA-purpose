import * as React from "react"
import { forwardRef } from "react";
interface ERPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validation?: string;
}

const ERPElementValidationMessage = forwardRef<HTMLInputElement, ERPInputProps>(({
  validation
}: ERPInputProps, ref) => {
  return (
   <>
    {validation && (
      <p className="text-danger font-light">
      {validation}
    </p>
     )}
   </>
  );
});

export default ERPElementValidationMessage;
