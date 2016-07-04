import React, {PropTypes as T} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import {loadImageFromUrl} from '../utils';
import Zooming from './zooming.jsx';
import css from './image-placement.less'

class ImagePlacement extends React.Component {

    static propTypes = {
        currentImageSrc: T.string,
        className: T.string,
        onClick: T.func,
        currentImagePlacement: T.object,
        isRepositionMode: T.bool,
        imageLoaded: T.func,
        displaySize: T.shape({
            width: T.number.isRequired,
            height: T.number.isRequired
        }),
        onPlacementChanged: T.func,
        allowZoom: T.bool,
        imageHolderCss: T.string,
        zoomingCss: T.string,
        fallback: T.string,
        style: T.object
    };

    static defaultProps = {
        allowZoom: false
    }

    constructor (props) {
        super(props);
        this.state = {
            hasPlacementStarted: false,
            determinesOwnDisplaySize: !props.displaySize,
            imageUrl: this.props.currentImageSrc || this.props.fallback
        };
    }

    componentDidMount () {
        this.measureOwnRoot();
        this.measureImageDimensions();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.currentImageSrc !== nextProps.currentImageSrc ||
            this.props.fallback !== nextProps.fallback) {
            this.setState({
                imageUrl: this.props.currentImageSrc || this.props.fallback
            }, this.measureImageDimensions.bind(this));
        }
    }

    measureImageDimensions () {
        const imageUrl = this.props.currentImageSrc || this.props.fallback;
        loadImageFromUrl(this.props.currentImageSrc || this.props.fallback)
            .then(image => {
                this.setState({
                    imageDimensions: {
                        height: image.height,
                        width: image.width
                    }
                });
            }, error => {
                console.error('error measuring image', imageUrl, error);
            });
    }

    measureOwnRoot () {
        const rootDOMNode = ReactDOM.findDOMNode(this.refs.moveableImageRoot);
        this.setState({
            ownDimensions: {
                width: rootDOMNode.offsetWidth,
                height: rootDOMNode.offsetHeight
            }
        });
    }

    reportNewPlacement = (data) => {
        console.log('report new placement');
    }

    onZoom (zoomType) {
        return () => {
            console.log('zoom', zoomType);
        };
    }

    handleImageClick = e => {

    }

    imagePositioningStyle () {
        console.assert(this.state.imageDimensions, 'Image must be measured');
        console.assert(this.state.ownDimensions, 'Own dimensions of element must be measured');
        const imageDimensions = this.state.imageDimensions;
        const scale = this.props.currentPlacement && this.props.currentPlacement.scale;
        const componentWidth = this.state.ownDimensions.width || 0;
        const style = {};
        style.width = componentWidth * scale;
        style.height = (style.width / imageDimensions.width) * imageDimensions.height;

        return style;
    }

    render () {
        const {currentImageSrc, fallback} = this.props;

        return (
            <div className={this.props.className || css.imagePlacement}
                 style={this.props.style}
                 ref='moveableImageRoot'>
                {
                    this.state.imageDimensions ? <img ref='currentImage'
                                                      src={currentImageSrc || fallback}
                                                      onClick={this.handleImageClick}
                                                      style={this.imagePositioningStyle()}>
                    </img> : null
                }
                {
                    this.props.allowZoom && this.props.isRepositionMode ?
                        <Zooming className={this.props.zoomingCss || css.zooming}
                                 onZoomIn={this.onZoom('in')}
                                 onZoomOut={this.onZoom('out')}/>
                        : null
                }
            </div>);
    }
}

export default ImagePlacement;
