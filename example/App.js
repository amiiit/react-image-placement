import React, {Component} from 'react';
import ImagePlacement from '../src/image-placement.jsx';
import css from './App.less';

const placementStyle = {
    width: '100%',
    height: '250px'
}

export default class App extends Component {

    constructor(props){
        super(props);
    }

    render () {
        return (
            // Add your component markup and other subcomponent references here.
            <div className={css.app}>
                <ImagePlacement
                    currentImageSrc="https://d3v07npo1k6y3q.cloudfront.net/fd0da27f-c069-4761-bbd3-6b8ff89a2430"
                    className={css.imagePlacement}
                />
            </div>
        );
    }
}
