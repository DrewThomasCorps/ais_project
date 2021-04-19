import React, {useState, Fragment} from 'react';

const SearchMenu = () => {
    const [menuState, setMenuState] = useState('closed');
    const [portSearchState, setPortSearchState] = useState('display-hidden');
    const [vesselSearchState, setVesselSearchState] = useState('display-hidden');

    const toggleMenu = () => {
        let newState = '';

        if (menuState === 'closed') {
            newState = 'open';
        } else {
            newState = 'closed';
            setPortSearchState('display-hidden');
            setVesselSearchState('display-hidden');
        }

        setMenuState(newState);
    }

    const toggleVesselSearch = () => {
        let newState = '';

        if (vesselSearchState === 'display-hidden' && menuState === 'closed') {
            newState = '';
            setPortSearchState('display-hidden')
            toggleMenu();
        } else if (vesselSearchState === 'display-hidden' && menuState === 'open') {
            newState = '';
            setPortSearchState('display-hidden')
        } else if (vesselSearchState === '' && menuState === 'closed') {
            setPortSearchState('display-hidden')
            toggleMenu();
        }

        setVesselSearchState(newState);
    }

    const togglePortSearch = () => {
        let newState = '';

        if (portSearchState === 'display-hidden' && menuState === 'closed') {
            newState = '';
            setVesselSearchState('display-hidden')
            toggleMenu();
        } else if (portSearchState === 'display-hidden' && menuState === 'open') {
            newState = '';
            setVesselSearchState('display-hidden')
        } else if (portSearchState === '' && menuState === 'closed') {
            setVesselSearchState('display-hidden')
            toggleMenu();
        }

        setPortSearchState(newState);
    }


    // TODO Add exit button
    return (
        <Fragment>
            <section className={`search-menu-container`}>
                <section className={`search-menu ${menuState}`}>
                    <section className={`search-menu-buttons-container`}>
                        <section className={`search-menu-buttons`}>
                        <button className={`menu-button`} onClick={toggleVesselSearch}>Find Vessels</button>
                        <button className={`menu-button`} onClick={togglePortSearch}>Find a Port</button>
                        <button className={`zoom-button`} onClick={toggleMenu}>+</button>
                        <button className={`zoom-button`} onClick={toggleMenu}>-</button>
                        </section>
                    </section>
                    <section className={`vessel-search ${vesselSearchState}`}>
                        <section className={`text-right`}>
                            <button className={`exit-button zoom-button`} onClick={toggleMenu}>X</button>
                        </section>
                        <section className={`search-panel`}>
                            <form>
                                <input type={`text`} placeholder={`ID`}/>
                                <input type={`text`} placeholder={`IMO`}/>
                                <input type={`text`} placeholder={`Built`}/>
                                <input type={`text`} placeholder={`Length`}/>
                                <input type={`text`} placeholder={`Breadth`}/>
                                <input type={`text`} placeholder={`Tonnage`}/>
                                <input type={`text`} placeholder={`Flag`}/>
                                <input type={`text`} placeholder={`Vessel Type`}/>
                            </form>
                        </section>
                    </section>
                    <section className={`port-search ${portSearchState}`}>
                        <section className={`text-right`}>
                            <button className={`exit-button zoom-button`} onClick={toggleMenu}>X</button>
                        </section>
                        <section className={`search-panel`}>
                        </section>
                    </section>
                </section>
            </section>
        </Fragment>
    )
}

export default SearchMenu;
