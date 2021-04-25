import React, {Fragment} from 'react';

const Port = ({ xPosition, yPosition }: {xPosition: number, yPosition: any}) => {
    const color = '#ffa200CC';

    return (
        <Fragment>
            <circle cx={xPosition} cy={yPosition} r=".25" strokeWidth="0" stroke={`#ffa20099`} fill={`${color}`}>
            </circle>
        </Fragment>
    )
}

export default Port;
