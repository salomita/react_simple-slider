import React, { Component } from 'react';
import styled from "styled-components";

const slides = [
  'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80',
  'https://images.unsplash.com/photo-1470341223622-1019832be824?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2288&q=80',
  'https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2094&q=80',
  'https://images.unsplash.com/photo-1534161308652-fdfcf10f62c4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2174&q=80'
]

export const StyledWrapper = styled.div`
position: relative;
height: 100vh;
width: 100vw;
margin: 0 auto;
overflow: hidden;
`;

export const StyledSlider = styled.div`
transform: translateX(-${props => props.translate}px);
transition: transform ease-out ${props => props.transition}s;
height: 100%;
width: ${props => props.width}px;
display: flex;
`;

const StyledSlide = styled.div`
flex: 0 0 100%;
height: 100%;
width: 100%;
background-image: url('${props => props.content}');
background-size: cover;
background-repeat: no-repeat;
background-position: center;
`

const StyledArrow = styled.div`
color: black;
display: flex;
position: absolute;
top: 50%;
${props => props.direction === 'right' ? `right: 25px` : `left: 25px`};
height: 50px;
width: 50px;
justify-content: center;
background: white;
border-radius: 50%;
cursor: pointer;
align-items: center;
transition: transform ease-in 0.1s;
&:hover {
  transform: scale(1.1);
}
img {
  transform: translateX(${props => props.direction === 'left' ? '-2' : '2'}px);
  &:focus {
    outline: 0;
  }
}`;

const Dot = styled.div`
padding: 10px;
margin-right: 5px;
cursor: pointer;
border-radius: 50%;
background: ${props => props.active ? 'black' : 'white'};
`;

const StyledDots = styled.div`
position: absolute;
bottom: 25px;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
`;

const Slide = ({ content }) => (
  <StyledSlide content={content} />
)

const Dots = ({ activeIndex, handleClick }) => (
  <StyledDots>
    {slides.map((slide, i) => (
      <Dot key={slide} active={activeIndex === i} onClick={() => handleClick(i)} />
    ))}
  </StyledDots>
)

const Arrow = ({ direction, handleClick }) =>
  <StyledArrow direction={direction} onClick={handleClick}>{direction === "left" ? "<" : ">"}</StyledArrow>;

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
      translate: this.getWidth(),
      transition: 0.5,
      slides: [slides[slides.length - 1], slides[0], slides[1]]
    };

    this.prevSlide = this.prevSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.gotoSlide = this.gotoSlide.bind(this);
    this.createSlides = this.createSlides.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(() => { this.nextSlide() }, 3000);
    this.transitionEnd = window.addEventListener('transitionend', this.createSlides);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    window.removeEventListener('transitionend', this.transitionEnd);
  }

  componentDidUpdate(prevProps, prevState) {
  }

  getWidth = () => window.innerWidth

  prevSlide() {
    const { activeIndex } = this.state;

    this.setState({
      ...this.state,
      activeIndex: activeIndex === 0 ? slides.length - 1 : activeIndex - 1,
      transition: 0.5,
      translate: 0
    });
  }

  nextSlide() {
    const { activeIndex, translate } = this.state;

    this.setState({
      ...this.state,
      activeIndex: activeIndex === slides.length - 1 ? 0 : activeIndex + 1,
      transition: 0.5,
      translate: translate + this.getWidth()
    });
  }

  gotoSlide(number) {
    this.setState({
      ...this.state,
      activeIndex: number,
      transition: 0.5,
      translate: number * this.getWidth()
    });
  }

  createSlides() {
    const { activeIndex } = this.state;
    let images = [];

    if (activeIndex === slides.length - 1) {
      images = [slides[slides.length - 2], slides[slides.length - 1], slides[0]];
    } else if (activeIndex === 0) {
      images = [slides[slides.length - 1], slides[0], slides[1]];
    } else {
      images = slides.slice(activeIndex - 1, activeIndex + 2)
    }

    this.setState({
      ...this.state,
      translate: this.getWidth(),
      transition: 0,
      slides: images
    });
  }

  render() {
    const { activeIndex, translate, transition, slides } = this.state;

    return (
      <StyledWrapper>
        <StyledSlider width={this.getWidth()} translate={translate} transition={transition}>
          {slides.map((slide, i) => (
            <Slide key={slide + i} content={slide} width={this.getWidth()} />
          ))}
        </StyledSlider>
        <Arrow direction="left" handleClick={() => { clearInterval(this.timer); this.prevSlide(); }} />
        <Arrow direction="right" handleClick={() => { clearInterval(this.timer); this.nextSlide(); }} />
        <Dots activeIndex={activeIndex} handleClick={this.gotoSlide} />
      </StyledWrapper>
    );
  }
}

export default Slider;
