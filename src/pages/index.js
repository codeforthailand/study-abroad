import React, { useState, useEffect } from "react"

import { useStaticQuery, graphql } from "gatsby"
import moment from "moment"

import { useQueryParam, StringParam } from 'use-query-params'


import Layout from "../components/layout"
import SEO from "../components/seo"
import config from "../config"

const headerStyle = {
  paddingBottom: "0.3em", 
  borderBottom: "1px solid"
}

const getQueryFromLocation = () => {
  if(typeof(window) === "undefined"){
    return "?thisisdummy=1"
  } else{
    return ""
  }
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
            const tag = t.trim()
            return <span style={{
              border: "1px solid",
              background: "green", 
              color: "white",
              padding: "3px 5px",
              borderRadius: "5px"
            }} key={tag}>
              {tag}
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
  const [queryType, setQueryType] = useQueryParam(
    "type",
    StringParam,
    getQueryFromLocation()
  )

  console.log(queryType)

  const [type, setType] = useState(queryType)

  const setTypeValue = (v) => {
    setQueryType(v)
    setType(v)
  }

  useEffect(() => {
    if(!type) {
      setTypeValue(config.types[0].value)
    }
  }, [])

  const today = moment()
  const db = useStaticQuery(graphql`
    query {
        allScholarshipsCsv {
          edges {
            node {
              name
              type
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

  const scholarships = db.allScholarshipsCsv.edges.map( s => {
      const deadline = moment(s.node.deadline, "DD/MM/YYYY")
      return {
        ...s.node,
        deadlineMoment: deadline,
        isAvailable: deadline > today 
      }
  })


  const selectedScholarships = scholarships.filter(s => s.type === type)

  const availableScholarships = selectedScholarships.filter(s => s.isAvailable)
  availableScholarships.sort( (a, b) => a.deadlineMoment - b.deadlineMoment)

  const notAvailableScholarships = selectedScholarships.filter(s => !s.isAvailable)

  notAvailableScholarships.sort((aa, bb) => {
    const a = aa.name
    const b = bb.name

    if( a < b ) { return -1 }
    else if (a > b) { return 1 }
    else { return 0 }
  } )


  return <Layout>
    <SEO title="Home" />
    <div style={{marginBottom: "2em"}}>
      <b>ทุนสำหรับ</b>
      <select value={type} onChange={(e) => setTypeValue(e.target.value)}>
        {
          config.types.map(t => {
            return <option key={t.value} value={t.value}>{t.name}</option>
          })
        }
      </select>
      <br/>
      <i>หมายเหตุ:
      ข้อมูลด้านล่างเกิดจากการรวบรวมของอาสาสมัคร ในกรณีที่มีข้อบกพร่อง หรือข้อเสนอแนะ สามารถแจ้งได้ที่
      {` `}<a style={{color: "black"}} href="https://github.com/codeforthailand/study-abroad">Github</a>
      </i>
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
