import React from "react";

// Imports to use bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

export function Square({ className, squareValue, onClick }: { className: string, squareValue: string | null, onClick: () => void }): any {
    return (
        <button type="button"
            className={`${className}`}
            onClick={onClick}>
            {squareValue}
        </button>
    );
}