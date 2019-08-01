import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import { useStaticQuery, graphql } from "gatsby"
import moment from "moment"

const headerStyle = {
  paddingBottom: "0.3em", 
  borderBottom: "1px solid"
}

const ScholarshipRow = ({data}) => {
  return <div style={{marginTop: "1.5em", marginBottom: "2em"}}>
    <h4 style={{padding: 0, margin: 0}}>
      <a style={{color: "black"}} href={data.url}>
        {data.name}
      </a>
    </h4>
    <div>
      <span>
        <b>{ data.isAvailable? "ปิดรับสมัคร" : "วันปิดรับสมัครครั้งก่อน" }:</b> {data.deadline}
      </span>
      <span style={{marginLeft: "2em"}}>
        <b>สถานที่เรียน:</b> {data.location}
      </span>
    </div>
    <div>
        <b>สาขาที่ครอบคลุม:</b> {` `}
      {
        data.topics
          .split(",")
          .map(t => { 
            return <span style={{
              border: "1px solid",
              background: "green", 
              color: "white",
              padding: "3px",
              borderRadius: "5px"
            }} key={t}>
              {t}
            </span>
          })
      }
    </div>
    { data.notes &&
      <i>หมายเหตุ: {data.notes}</i>
    }
  </div>
}

const IndexPage = () => {
  const db = useStaticQuery( graphql`
    query {
        allScholarshipsCsv {
          edges {
            node {
              name
              url
              location
              topics
              deadline
              notes
            }
          }
        }
      }
    `
  )

  const today = moment()

  const scholarships = db.allScholarshipsCsv.edges.map( s => {
    const deadline = moment(s.node.deadline, "DD/MM/YYYY")
    return {
      ...s.node,
      deadlineMoment: deadline,
      isAvailable: deadline > today 
    }
  })

  const availableScholarships = scholarships.filter(s => s.isAvailable)
  availableScholarships.sort( (a, b) => a.deadlineMoment - b.deadlineMoment)

  const notAvailableScholarships = scholarships.filter(s => !s.isAvailable)

  notAvailableScholarships.sort((aa, bb) => {
    const a = aa.name
    const b = bb.name

    if( a < b ) { return -1 }
    else if (a > b) { return 1 }
    else { return 0 }
  } )


  return <Layout>
    <SEO title="Home" />
    <div style={{fontWeight: "bold", marginBottom: "2em"}}>
      <b>ทุนในระดับ</b>
      <select><option>ปริญญาเอก</option></select>
    </div>
    <div>
      <h3 style={headerStyle}>ทุนที่เปิดรับสมัครในขณะนี้ ({availableScholarships.length} ทุน)</h3>
      <div>
        { 
          availableScholarships.map(r => <ScholarshipRow key={r.name} data={r}/>)
        }
      </div>
      <h3 style={headerStyle}>ทุนอื่นๆ ({notAvailableScholarships.length} ทุน) </h3>
      <div>
        { 
          notAvailableScholarships.map(r => <ScholarshipRow key={r.name} data={r}/>)
        }
      </div>
    </div>
  </Layout>
}

export default IndexPage
