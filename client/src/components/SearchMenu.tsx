import React, {useState, Fragment} from 'react';

/**
 * Controls the collapsible search menu and includes buttons for zoom and search actions.
 * @param zoomMode
 * @param setZoomMode
 * @constructor
 */
const SearchMenu = ({ zoomMode, setZoomMode }: {zoomMode: string, setZoomMode: any}) => {
    const [menuState, setMenuState] = useState('closed');

    /**
     * Toggles current visibility of collapsible menu.
     */
    const toggleMenu = () => {
        let newState = '';

        if (menuState === 'closed') {
            newState = 'open';
        } else {
            newState = 'closed';
        }

        setMenuState(newState);
    }

    /**
     * Toggles app level zoom mode when zoom in button is clicked.
     * @param e
     */
    const handleZoomInClick = (e: { preventDefault: () => void;}) => {
        if (zoomMode === '') {
            setZoomMode('in');
        } else if ( zoomMode === 'in') {
            setZoomMode('');
        } else if ( zoomMode === 'out')  {
            setZoomMode('in');
        }
    }

    /**
     * Toggles app level zoom mode when zoom out button is clicked.
     * @param e
     */
    const handleZoomOutClick = (e: { preventDefault: () => void;}) => {
        if (zoomMode === '') {
            setZoomMode('out');
        } else if ( zoomMode === 'out') {
            setZoomMode('');
        } else if ( zoomMode === 'in')  {
            setZoomMode('out');
        }
    }

    return (
        <Fragment>
            <section className={`search-menu-container`}>
                <section className={`search-menu ${menuState}`}>
                    <section className={`search-menu-buttons-container`}>
                        <section className={`search-menu-buttons`}>
                        <button className={`menu-button`} onClick={toggleMenu}>
                            <svg x="0px" y="0px" width="12px" height="12px" viewBox="0 0 30.239 30.239">
                                <path d="M20.194,3.46c-4.613-4.613-12.121-4.613-16.734,0c-4.612,4.614-4.612,12.121,0,16.735   c4.108,4.107,10.506,4.547,15.116,1.34c0.097,0.459,0.319,0.897,0.676,1.254l6.718,6.718c0.979,0.977,2.561,0.977,3.535,0   c0.978-0.978,0.978-2.56,0-3.535l-6.718-6.72c-0.355-0.354-0.794-0.577-1.253-0.674C24.743,13.967,24.303,7.57,20.194,3.46z    M18.073,18.074c-3.444,3.444-9.049,3.444-12.492,0c-3.442-3.444-3.442-9.048,0-12.492c3.443-3.443,9.048-3.443,12.492,0   C21.517,9.026,21.517,14.63,18.073,18.074z"></path>
                            </svg>
                        </button>
                        <button className={`zoom-button zoom-in ${zoomMode}`} onClick={handleZoomInClick}>+</button>
                        <button className={`zoom-button zoom-out ${zoomMode}`} onClick={handleZoomOutClick}>-</button>
                        </section>
                    </section>
                    <section className={`vessel-search`}>
                        <section className={`float-right`}>
                            <button className={`exit-button zoom-button display-block ghost-button`} onClick={toggleMenu}>
                                <svg x="0px" y="0px" viewBox="0 0 27.965 27.965">
		                            <path d="M13.98,0C6.259,0,0,6.261,0,13.983c0,7.721,6.259,13.982,13.98,13.982c7.725,0,13.985-6.262,13.985-13.982    C27.965,6.261,21.705,0,13.98,0z M19.992,17.769l-2.227,2.224c0,0-3.523-3.78-3.786-3.78c-0.259,0-3.783,3.78-3.783,3.78    l-2.228-2.224c0,0,3.784-3.472,3.784-3.781c0-0.314-3.784-3.787-3.784-3.787l2.228-2.229c0,0,3.553,3.782,3.783,3.782    c0.232,0,3.786-3.782,3.786-3.782l2.227,2.229c0,0-3.785,3.523-3.785,3.787C16.207,14.239,19.992,17.769,19.992,17.769z"/>
                                </svg>
                            </button>
                        </section>
                        <section className={`search-panel text-center`}>
                            <section className={`panel-container`}>
                                <section className={`panel-inner p-2`}>
                                    Search by Vessel MMSI
                                    <form>
                                        <input type={`text`} placeholder={`Vessel MMSI`}/>
                                    </form>
                                </section>
                            </section>
                            <section className={`panel-container`}>
                                <section className={`panel-inner`}>
                                    Search by Destination Port
                                    <form>
                                        <input type={`text`} placeholder={`Port Name`}/>
                                    </form>
                                </section>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </Fragment>
    )
}

export default SearchMenu;
