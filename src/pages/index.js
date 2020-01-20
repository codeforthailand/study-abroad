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
  if(typeof window !== 'undefined' && window) {
    return "" // useQueryParam will parse query params automatically
  } else {
    return "?dummy-param"
  }
}

const ScholarshipRow = ({data}) => {
  const topics = data.topics.trim().split(",").filter(x => x)

  return <div style={{marginTop: "1.5em", marginBottom: "2em"}}>
    <h4 style={{padding: 0, margin: "5px 0"}}>
      <a style={{color: "black"}} href={data.url}>
        {data.name}
      </a>
    </h4>
    <div>
      <span>
        <b>{ data.isAvailable? "ปิดรับสมัคร" : "ปิดรับสมัครครั้งก่อน" }:</b> {data.deadline}
      </span>
      <span style={{marginLeft: "2em"}}>
        <b>สถานที่เรียน:</b> {data.location}
      </span>
    </div>
    { topics.length > 0 &&
      <div>
          <b>สาขาที่ครอบคลุม:</b> {` `}
        {
            topics
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
    }
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

  const [type, setType] = useState()

  const setTypeValue = (v) => {
    setQueryType(v)
    setType(v)
  }

  useEffect(() => {
    setType(queryType || config.types[0].value)
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
    <img src={'cover.png'} title="รายชื่อทุนเรียนและฝึกงาน ด้านคอมพิวเตอร์ และสาขาที่เกี่ยวข้อง" alt="รายชื่อทุนเรียนและฝึกงาน ด้านคอมพิวเตอร์ และสาขาที่เกี่ยวข้อง" />
    <div style={{ marginBottom: "3em" }}>
      <b>ทุนสำหรับ
      <select value={type} onChange={(e) => setTypeValue(e.target.value)}>
        {
          config.types.map(t => {
            return <option key={t.value} value={t.value}>{t.name}</option>
          })
        }
      </select>
      </b>
      <br/>
      <i>หมายเหตุ:
      ข้อมูลทั้งหมดมาจากการรวบรวมของอาสาสมัคร ข้อมูลเช่น วันปิดรับสมัคร อาจมีการเปลี่ยนแปลงได้
      กรุณาตรวสอบข้อมูลกับเว็บไซต์ต้นทางและสถานศึกษา/วิจัยอีกครั้ง หากพบข้อบกพร่องหรือมีข้อเสนอแนะ กรุณาแจ้งที่
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
    <div>
        <h3>ฐานข้อมูลทุนและโอกาสฝึกงานอื่นๆ</h3>
        <ul>
            <li><a href="https://jobs.computer.org/jobs">IEEE/Computer Society</a> (กดตรง "Level" จะมี internship และ summer research ให้เลือก)</li>
            <li><a href="https://euraxess.ec.europa.eu/jobs/search">EURAXESS</a> ฐานข้อมูลโครงการวิจัยในสหภาพยุโรป (ค้นทุนด้วยคำว่า studentship, scholarship, fellowship, fellow, phd, doctoral, postdoc ฯลฯ)</li>
            <li><a href="https://www.findaphd.com/">FindPhD</a> ค้นทุนป.เอก ทั่วโลก โดยเฉพาะในสหราชอาณาจักร</li>
            <li><a href="https://jobs.sciencecareers.org/jobs/">Science Careers</a></li>
            <li><a href="https://internetfreedomfestival.org/job-board/">Internet Freedom Festival Commounty Job Board</a> จะมีประกาศ fellowship/internship รวมถึงตำแหน่งงานที่เกี่ยวกับการใช้ความรู้สาขาคอมพิวเตอร์กับกับสังคม</li>
        </ul>
    </div>
  </Layout>
}

export default IndexPage
