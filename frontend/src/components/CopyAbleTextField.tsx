import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

function CopyAbleTextField({ value }: { value: string }) {
    const [copyStatus, setCopyStatus] = useState(false);
    const [timeoutCode, setTimeoutCode] = useState(NaN);

    function onCopyText() {
        setCopyStatus(true);
        const code = setTimeout(reset, 1000);
        setTimeoutCode(code);
    };

    function reset() {
        setTimeoutCode(NaN);
        setCopyStatus(false);
    }

    function onClickHandler() {
        clearTimeout(timeoutCode);
        reset();
    }

    return copyStatus ? (
        <input type="text" readOnly={true} value={"COPIED"} onClick={onClickHandler} />
    ) : (
        <CopyToClipboard text={value} onCopy={onCopyText}>
            <input type="text" readOnly={true} value={value} />
        </CopyToClipboard>
    );
}
export default CopyAbleTextField;