import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import GitHubButton from 'react-github-btn'

const Header = ({ siteTitle }) => (
  <header
    style={{
      marginBottom: `1.45rem`,
    }}
  >
    <h3
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <div style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `black`,
            textDecoration: `none`,
          }}
        >
          {siteTitle}
        </Link>
        {`  `}
        <GitHubButton
          href="https://github.com/codeforthailand/study-abroad"
          data-icon="octicon-star"
          aria-label="Star codeforthailand/study-abroad on GitHub">
            Star
        </GitHubButton>
      </div>
    </h3>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
