import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Rules() {
    const [showOverlay, setShowOverlay] = useState(false);
    const overlayToggle = () => { setShowOverlay(!showOverlay) };
    const children = 'Hey Whats up';

    function Overlay({ isOpen, onClose }) {
        return (
            <Fragment>
                {isOpen && (
                    <div className='overlay'>
                        <div className='overlay-background' onClick={onClose} />
                        <div className='overlay-container'>
                            <button className='overlay-close' onClick={onClose} />
                            <p className='status'>{children} </p>
                        </div>
                    </div>
                )};
            </Fragment>
        );
    }

    return (
        <div>
            <div className='main-menu'>
                <p>These are the Rules</p>
                <div className='overlay-status'>Overlay: {showOverlay ? 'true' : 'false'}</div>
                <Link className='main' style={{ textDecoration: 'none' }} to='/'>Main Menu
                </Link>
            </div>
            <button className='overlay' onClick={overlayToggle}>Overlay</button>
            <Overlay isOpen={showOverlay} onClose={overlayToggle} children={children}>
            </Overlay>

        </div>
    );

}