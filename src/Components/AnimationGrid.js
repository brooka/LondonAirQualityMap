import React from 'react'
import anime from 'animejs'
import Transition from 'react-transition-group/Transition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import './../documentation.css';
import './../particles.css';
// we will trigger an event on the actual grid node after the exit animation completes
// to let the transitiongroup know that it can be removed from the DOM
// this is the only way to let react-transition-group delegate timing
// to the JavaScript animation, as far as I can tell
const ANIMATION_DONE_EVENT = 'animation::done';
const triggerAnimationDoneEvent = node =>
    node.dispatchEvent(new Event(ANIMATION_DONE_EVENT));

// cache current animation so that it can be interrupted if necessary
let currentAnimation = null;
const clearCurrentAnimation = () => currentAnimation && currentAnimation.pause();

const getOpacity = animatingIn => ({
    value: animatingIn ? [0, 1] : [1, 0],
    easing: 'linear',
    duration: 30
});

const animateGridIn = gridContainer => {
    clearCurrentAnimation();
    const cards = gridContainer.querySelectorAll('.card')
    currentAnimation = anime
        .timeline()
        .add({
            targets: cards,
            opacity: 0,
            duration: 1
        })
        .add({
            targets: gridContainer,
            translateX: [-1000, 0],
            opacity: getOpacity(true),
            duration: 300
        })
        .add({
            targets: cards,
            duration: 800,
            opacity: getOpacity(true),
            translateY: [-300, 0],
            complete: () => triggerAnimationDoneEvent(gridContainer),
            delay: (el, i) => i * 400
        })
};

const animateGridOut = gridContainer => {
    clearCurrentAnimation();
    const cards = gridContainer.querySelectorAll('.card');
    gridContainer.style.height = gridContainer.offsetHeight + 'px';
    currentAnimation = anime
        .timeline()
        .add({
            targets: cards,
            duration: 700,
            opacity: getOpacity(false),
            translateY: -30,
            delay: (el, i) => i * 100
        })
        .add({
            targets: gridContainer,
            translateX: 1000,
            opacity: getOpacity(false),
            duration: 300,
            complete: () => triggerAnimationDoneEvent(gridContainer),
            offset: '-=300'
        })
};

const animateCardIn = card =>
    anime({
        targets: card,
        opacity: getOpacity(true),
        translateY: [50, 0],
        complete: () => triggerAnimationDoneEvent(card),
        duration: 300
    });

const animateCardOut = card =>
    anime({
        targets: card,
        translateY: -10,
        opacity: getOpacity(false),
        complete: () => triggerAnimationDoneEvent(card),
        duration: 300
    });

const animateSVG = () => {
    console.log("triggered");
    var timelineParameters = anime.timeline({
        direction: 'alternate',
        loop: true
    });

    timelineParameters
        .add({
            targets: '#timelineParameters .square.el',
            translateX: [{value: -80}, {value: 160}, {value: 250}],
            translateY: [{value: 0}, {value: 60}, {value: 60}],
            duration: 3000
        })
        .add({
            targets: '#timelineParameters .circle.el',
            translateX: [{value: 80}, {value: 160}, {value: 250}],
            translateY: [{value: 30}, {value: 60}, {value: -30}],
            duration: 3000,
            offset: 200
        })
        .add({
            targets: '#timelineParameters .triangle.el',
            translateX: [{value: 80}, {value: 250}],
            translateY: [{value: -60}, {value: -30}, {value: -30}],
            duration: 3000,
            offset: 400
        });
};

const particleAnimation = gridContainer => {
    clearCurrentAnimation();
    const cards = gridContainer.querySelectorAll('.card');
    currentAnimation = anime
        .timeline()
        .add({
            targets: cards,
            opacity: getOpacity(true),
            translateY: [
                {value: [-500, 0], duration: 1600, elasticity: 0, easing: 'linear',}
            ],
            complete: (el, i) => {
                console.log(el);
                console.log(i);
                triggerAnimationDoneEvent(gridContainer)
            },
            delay: (el, i) => i * 1000
        })
};

const particleAnimationHorizontal = (gridContainer, props) => {
    const cards = gridContainer.querySelectorAll('.note' + props.variation);
    const TEMPO = 800;
    const notes = props.pieces;

    currentAnimation = anime
        .timeline()
        .add({
            targets: cards,
            opacity: getOpacity(true),
            translateX: [
                {value: [1000, 0], duration: 3000, easing: 'linear'}
            ],
            complete: (el, i) => {
                triggerAnimationDoneEvent(gridContainer)
            },
            delay: (el, i) => notes[i].startTime * TEMPO
        })

    var svgAttributes = anime({
        targets: 'playLine',
        easing: 'easeInOutExpo',
        direction: 'alternate',
        loop: true,
        duration: 200,
        delay: TEMPO
    });
};


const TransitionGrid = props => (
    <Transition
        unmountOnExit
        appear
        addEndListener={(node, done) =>
            node.addEventListener(ANIMATION_DONE_EVENT, done)
        }
        onEnter={animateGridIn}
        onExit={animateGridOut}
        in={props.visible}
    >
        <ul className="grid animated-grid">
            <TransitionGroup component={null}>
                {
                    props.cradles.map(item => (
                        <Transition
                            key={item}
                            onEnter={animateCardIn}
                            onExit={animateCardOut}
                            addEndListener={(node, done) =>
                                node.addEventListener(ANIMATION_DONE_EVENT, done)
                            }
                        >
                            <li className={`note${props.key} card `} onClick={() => props.removeItem(item)}>
                                <div className="close-card">&#x2715;</div>
                                <div>{item}</div>
                            </li>
                        </Transition>
                    ))}
            </TransitionGroup>
        </ul>
    </Transition>
);

const Particles = props => (
    <Transition
        unmountOnExit
        appear
        addEndListener={(node, done) =>
            node.addEventListener(ANIMATION_DONE_EVENT, done)
        }
        onEnter={(node, done) => {
            particleAnimationHorizontal(node, props);
        }}
        in={props.visible}
    >
        <div className="particle-container">

            <span className="playLine"> </span>
            {props.pieces.map(item => (
                <div>
                    <span className={`note${props.variation} card particle`}> {item.note} </span>
                </div>
            ))}
        </div>
    </Transition>
);

const Anitest = props => (
    <Transition in={true} appear onEntered={animateSVG} timeout={1000}>
        <div id="timelineParameters">
            <div className="line">
                <div className="square el"></div>
            </div>
            <div className="line">
                <div className="circle el"></div>
            </div>
            <div className="line">
                <div className="triangle el"></div>
            </div>
        </div>
    </Transition>
);


export default Particles