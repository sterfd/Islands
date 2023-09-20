export function TutSquare({ value, onSquareClick }) {
    let squareClass = 'land square';
    if (value === 0) {
        squareClass = 'water square';
    } else if (value === -2) {
        squareClass = 'tile square';
    } else if (value === -3) {
        squareClass = 'glow tile square';
    } else if (value === -4) {
        squareClass = 'glow land square';
    } else if (value === -5) {
        squareClass = 'glow water square';
    }
    return (
        <button className={squareClass} onClick={onSquareClick} onContextMenu={onSquareClick}>
            {(value > 0) ? value : null}</button>
    )
}