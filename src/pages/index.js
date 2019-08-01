import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import { useStaticQuery, graphql } from "gatsby"
import moment from "moment"

const ScholarshipRow = ({data}) => {
  console.log(data)
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
      isAvailable: deadline > today 
    }
  })

  const availableScholarships = scholarships.filter(s => s.isAvailable)
  const notAvailableScholarships = scholarships.filter(s => !s.isAvailable)

  return <Layout>
    <SEO title="Home" />
    <div style={{fontWeight: "bold", marginBottom: "2em"}}>
      <b>ทุนในระดับ</b>
      <select><option>ปริญญาเอก</option></select>
    </div>
    <div>
      <h4>ทุนที่เปิดรับสมัครในขณะนี้ ({availableScholarships.length} ทุน)</h4>
      <div>
        { 
          availableScholarships.map(r => <ScholarshipRow key={r.name} data={r}/>)
        }
      </div>
      <h4 style={{padding: "0", margin: "0"}}>ทุนอื่นๆ ({notAvailableScholarships.length} ทุน) </h4>
      <div>
        { 
          notAvailableScholarships.map(r => <ScholarshipRow key={r.name} data={r}/>)
        }
      </div>
    </div>
  </Layout>
}

export default IndexPage
