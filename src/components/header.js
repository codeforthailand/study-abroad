import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

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
        paddingBottom: 0,
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
        <a href="https://github.com/codeforthailand/study-abroad">
          <img 
            style={{verticalAlign: "middle", height: "20px", marginTop: "20px"}}
            src="https://img.shields.io/github/stars/codeforthailand/study-abroad?style=social"
          />
        </a>
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
