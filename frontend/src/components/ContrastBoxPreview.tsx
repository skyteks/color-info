import "./ContrastBoxPreview.css";

function ContrastBoxPreview({ color }: { color: string }) {

    return (
        <div className="contrast-box">
            <div className="contrast-black" />
            <div className="contrast-color" style={{ backgroundColor: color }} />
            <div className="contrast-white" />
        </div>
    );
}
export default ContrastBoxPreview;