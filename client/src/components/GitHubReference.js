import React from 'react';

const githubIcon = process.env.PUBLIC_URL + "/githubIcon.png";

const GitHubReference = () => {

    const navigateToGitHub = () => { 
        const win = window.open("https://github.com/Jurajzovinec/Surf-Shaper", '_blank');
        win.focus();
    };

    return (
        <div className="git-hub-ref">
            <img src={githubIcon} className="git-img" onClick={navigateToGitHub} />
        </div>
    )
}

export default GitHubReference;
