import React, {useState} from 'react'
import {Swipeable} from "react-swipeable"
import { useRouter } from 'next/router'
import {createGlobalStyle} from "styled-components"
import Slide from "../components/Slide"
import useEventListener from '../hooks/useEventListener'
import { useTotalPages } from '../context/TotalPagesContext'

const GlobalStyle = createGlobalStyle`
  :root {
    --bg: #050505;
    --meta: #888;
    --accent: rgb(0, 92, 221);
    --text: #FAFAFA;
    --base: 1.5rem;
    --code: 1rem;
    --heading-font-family: "Poppins";
    --heading-font-weight: 800;
  }

  @media (max-width: 600px) {
    :root {
      --base: 1.2rem;
    }
  }

  * {
    box-sizing: border-box;
  }

  body,
  html {
    font-family: "Roboto", -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: var(--base);
    -webkit-font-smoothing: antialiased;
    font-feature-settings: 'calt', 'liga', 'hist', 'onum', 'pnum';

    overflow: auto;

    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;

    color: var(--text);
    background-color: var(--bg);
  }

  #slide {
    display: flex;
    overflow: hidden;
    justify-content: center;
    align-items: center;

    width: 100vw;
    height: 100vh;
    padding: 1rem;

    text-align: center;

    -webkit-overflow-scrolling: touch;
  }

  #slide ul {
      text-align: left;
      margin-left: 32px;
  }

  a {
    color: var(--text);

    text-decoration-skip-ink: auto;
  }

  blockquote {
    font-size: 120%;
    font-weight: bold;

    width: 50vw;

    text-align: left;
  }

  @media (max-width: 900px) {
    blockquote {
      width: 90vw;
    }
  }

  blockquote div::before {
    content: '\\201C';
  }

  blockquote div::after {
    content: '\\201D';
  }

  cite {
    font-size: 80%;
    font-weight: normal;
    font-style: normal;

    display: block;

    margin-top: 2rem;
  }

  cite::before {
    content: '\\2014\\00a0';
  }

  pre {
    font-size: 0.75em !important;

    display: inline-block;
    overflow-x: scroll;

    margin: 2rem 0;

    text-align: left;

    color: var(--accent);
  }

  code {
    font-family: menlo, monospace;
  }

  a:hover {
    color: var(--accent);
  }

  h1 {
    font-family: var(--heading-font-family);
    font-weight: var(--heading-font-weight);
    font-size: 200%;

    margin-bottom: 0.5rem;
  }

  h2 {
    font-family: var(--heading-font-family);
    font-weight: var(--heading-font-weight);
    font-size: 120%;

    margin-bottom: 0.5rem;
  }

  p {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  header {
    font-size: 50%;

    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    padding: 20px;

    user-select: none;
  }

  header a,
  time {
    text-decoration: none;

    color: var(--meta);
  }

  header a:hover {
    color: var(--meta);
  }

  header span {
    color: var(--text);
  }
`

export default function SlidePage({children}) {
    const initialSlide = window.location.hash ? parseInt(window.location.hash.replace("#", "")) : 0
    const [currentSlide, setSlide] = useState(initialSlide)
  const router = useRouter()
  const totalPages = useTotalPages()

  const NEXT = [13, 32, 39]
  const PREV = 37
  let slideCount = 0
  console.log('query params', router.asPath, )

  const navigate = ({ keyCode }) => {

      if (keyCode === PREV && currentSlide === 0) {
          if (router.query && router.query.slide) {
              if (router.query.slide > 1) {
                router.push(`/slides/${parseInt(router.query.slide) - 1}`)
              }
          }
        return false
      } if (NEXT.indexOf(keyCode) !== -1 && currentSlide === slideCount) {
          if(router.query && router.query.slide) {
              // Check for max page count
              if(router.query.slide < totalPages) {
                router.push(`/slides/${parseInt(router.query.slide) + 1}`)
              }
          }
          return false
        } if (NEXT.indexOf(keyCode) !== -1) {
          setSlide((prevState) => {
            window.location.hash = `#${prevState + 1}`
            return prevState + 1
          })
      } else if (keyCode === PREV) {
          setSlide((prevState) => {
            window.location.hash = `#${prevState - 1}`
            return prevState - 1
          })
      }
  }

  useEventListener('keydown', navigate)

  const swipeLeft = () => {
    navigate({ keyCode: NEXT[0] })
  }

  const swipeRight = () => {
    navigate({ keyCode: PREV })
  }

  const renderSlide = () => {

    let generatedSlides = []
    let generatorCount = 0

    // Filter down children by only Slides
    React.Children.map(children, (child) => {
        // Check for <hr> element to separate slides
        const childType = child && child.props && (child.props.mdxType || [])
        if (childType && childType.includes('hr')) {
            generatorCount += 1
            return
        }

        // Add slide content to current generated slide
        if (!Array.isArray(generatedSlides[generatorCount])) {
            generatedSlides[generatorCount] = []
        }
        generatedSlides[generatorCount].push(child)
    });
    // Then find slide number that matches state
    const findCurrentSlide = generatedSlides.filter((child, index) => {
      return index === currentSlide
    })
    if (!findCurrentSlide) {
      return null
    }
    // Get total slide count
    slideCount = generatorCount

    // Return current slide
    return <Slide>{generatedSlides[currentSlide]}</Slide>
  }


    return (
      <Swipeable onSwipedLeft={swipeLeft} onSwipedRight={swipeRight}>
        <GlobalStyle />
        <div id="slide" style={{ width: '100%' }}>
          {renderSlide()}
        </div>
      </Swipeable>
    )
}