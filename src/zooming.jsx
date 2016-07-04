import React, {PropTypes as T} from 'react';
import css from './zooming.less';
import _ from 'lodash';

let interval;

function startZooming (onClick) {
    interval = setInterval(() => {
        onClick();
    }, 100);
}

function stopZooming () {
    clearInterval(interval);
}

function ZoomButton (props) {

    return (
        <div className={props.className}
             onMouseDown={_.partial(startZooming, props.onClick)}
             onTouchStart={_.partial(startZooming, props.onClick)}
             onTouchEnd={stopZooming}
             onClick={props.onClick}
             onMouseUp={stopZooming}
             onMouseOut={stopZooming}>
            {props.children}
        </div>);
}

ZoomButton.propTypes = {
    children: T.oneOf([T.string, T.object]).isRequired,
    onClick: T.func.isRequired,
    className: T.string
};

function Zooming (props) {
    return (
        <div className={props.className || css.zooming}>
            <ZoomButton className={css.button} onClick={props.onZoomIn}>+</ZoomButton>
            <ZoomButton className={css.button} onClick={props.onZoomOut}>-</ZoomButton>
        </div>);
}

Zooming.propTypes = {
    className: T.string,
    onZoomIn: T.func.isRequired,
    onZoomOut: T.func.isRequired
};

export default Zooming;
