module.exports = {
  pathPrefix: "/study-abroad",
  siteMetadata: {
    title: `ทุนการศึกษาทางด้านคอมพิวเตอร์และสาขาที่เกี่ยวข้อง`,
    description: `ส่งเสริมให้คนไทยมีประสบการณ์การวิจัยค้นคว้าในต่างประเทศ`,
    author: `Code for Thailand`,
    url: `https://codeforthailand.github.io/study-abroad`, // No trailing slash allowed!
    image: `https://codeforthailand.github.io/study-abroad/cover.png`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-transformer-csv`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-48736618-6",
      }
    }
  ],
}
