import React, {Fragment} from 'react';

const Alert = ({ alertText }: {alertText: string}) => {
    return (
        <section className={`alert`}>
            { alertText }
        </section>
    )
};

export default Alert;
