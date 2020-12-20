import React from 'react';

//let win = Dimensions.get('window');
//console.log(win);
export default function BackgroundImg() {
    return (
        <div className="background-img">
            <img src={process.env.PUBLIC_URL + '/greatWaveOfKanagawa.jpg'} />
        </div>
    )
}
