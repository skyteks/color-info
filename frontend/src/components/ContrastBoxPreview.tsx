import Color from "../../../Color";
import "./ContrastBoxPreview.css";

function ContrastBoxPreview({ color }: { color: string }) {

    return (
        <div className="contrast-box">
            <div className="contrast-black" />
            <div className="contrast-white" />
            <div className="contrast-color" style={{ backgroundColor: color }} />
        </div>
    );
}
export default ContrastBoxPreview;