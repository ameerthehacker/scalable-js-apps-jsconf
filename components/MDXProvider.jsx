import React from 'react'
import { MDXProvider } from '@mdx-js/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import okaidia from 'react-syntax-highlighter/dist/cjs/styles/prism/okaidia'
import SlidePage from '../layouts/SlidePage'
import Cover from './Cover'

const mdComponents = {
  h1: (props) => <h1 {...props} />,
  pre: (props) => props.children,
  code: (props) => {
    console.log('syntax props', props)
    const {className} = props
    const language = className.replace("language-", "");
    return (
      <SyntaxHighlighter className={className} language={language} style={okaidia} {...props} />
  )},
  Cover,
  SlidePage,
}

export default ({ children }) => (
  <MDXProvider components={mdComponents}>{children}</MDXProvider>
)