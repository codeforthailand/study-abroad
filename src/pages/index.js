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
        isAvailable: deadline >= today 
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
    <img src={'cover.png'} title="รายชื่อทุนเรียนและฝึกงาน ด้านคอมพิวเตอร์ สารสนเทศ ดิจิทัล และสาขาที่เกี่ยวข้อง" alt="รายชื่อทุนเรียนและฝึกงาน ด้านคอมพิวเตอร์ สารสนเทศ ดิจิทัล และสาขาที่เกี่ยวข้อง" />
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
      <br/>
      <details>
        <summary>
          <i>ข้อมูลเกี่ยวกับประเภทของสาขาวิชาและที่มาของข้อมูล (คลิกที่นี่เพื่อดู):</i>
        </summary>
        <ul>
          <li>หลักสูตร "คอมพิวเตอร์" ของหลายที่มีลักษณะสหวิทยาการสูง ผู้สมัครไม่จำเป็นต้องเรียนมาตรงสาย สายวิทยาศาสตร์อื่นๆ 
        สายมนุษยศาสตร์ และสายสังคมศาสตร์ก็อาจสมัครได้ รวมถึงหลักสูตรปริญญาเอกในบางประเทศสามารถใช้วุฒิปริญญาตรีสมัครได้เลย
        ให้ดูรายละเอียดและติดต่อโดยตรงกับทางหลักสูตรหรืออาจารย์ที่คิดว่าน่าจะเป็นที่ปรึกษาได้</li>
          <li>ข้อมูลทั้งหมดมาจากการรวบรวมของอาสาสมัคร ข้อมูลเช่น วันปิดรับสมัคร อาจเปลี่ยนแปลงได้ กรุณาตรวสอบกับเว็บไซต์ต้นทางและหน่วยงานอีกครั้ง</li>
          <li>บางทุนเป็นโครงการต่อเนื่องหลายปี วันปิดรับสมัครอาจเลยมาแล้วจากข้อมูลในนี้ แต่โครงการอาจเปิดจนกว่าจะได้ครบตำแหน่งที่รับหรือเปิดรับรอบใหม่ทุกปี แนะนำให้กดดูที่เว็บไซต์โครงการ ถ้าสนใจ</li>
          <li>พบข้อบกพร่อง มีข้อเสนอแนะ แจ้งทุนเพิ่มเติม กรุณาแจ้งที่
          {` `}<a style={{color: "black"}} href="https://github.com/codeforthailand/study-abroad">GitHub</a></li>
        </ul>
      </details>
    </div>
    <div>
      <h3 style={headerStyle}>ทุนที่เปิดรับสมัครในขณะนี้ ({availableScholarships.length} ทุน)</h3>
      <div>
        { 
          availableScholarships.map(r => <ScholarshipRow key={r.name} data={r}/>)
        }
      </div>
      <h3 style={headerStyle}>ทุนอื่นๆ ({notAvailableScholarships.length} ทุน)</h3>
      <div>
        { 
          notAvailableScholarships.map(r => <ScholarshipRow key={r.name} data={r}/>)
        }
      </div>
    </div>
    <hr />
    <div>
        <h3>ฐานข้อมูลทุนและโอกาสฝึกงานอื่นๆ</h3>
        <ul>
            <li><a href="https://jobs.computer.org/jobs">IEEE/Computer Society</a> (กดตรง "Level" จะมี internship และ summer research ให้เลือก)</li>
            <li><a href="https://euraxess.ec.europa.eu/jobs/search">EURAXESS</a> ฐานข้อมูลโครงการวิจัยในสหภาพยุโรป (ค้นทุนด้วยคำว่า studentship, scholarship, fellowship, fellow, phd, doctoral, postdoc ฯลฯ)</li>
            <li><a href="https://www.findaphd.com/">FindPhD</a> ค้นทุนป.เอก ทั่วโลก โดยเฉพาะในสหราชอาณาจักร</li>
            <li><a href="https://jobs.sciencecareers.org/jobs/">Science Careers</a> มีทั้งตำแหน่งงาน ทุนป.เอก หลังปริญญาเอก ฝึกงาน</li>
            <li>เว็บไซต์รวมทุน รายประเทศ: <a href="https://www.daad.de/en/study-and-research-in-germany/scholarships/">DAAD (เยอรมนี)</a>
                | <a href="https://www.studyinholland.nl/finances">Study in Holland (เนเธอร์แลนด์์)</a></li>
            <li>
                เว็บไซต์รวมแหล่งฝึกงาน: <a href="https://www.internships.com/computer-science">Chegg Internships</a>
                | <a href="https://www.gradcracker.com/search/computing-technology/computer-science-work-placements-internships">Gradcracker</a>
                | <a href="https://www.computersciencedegreehub.com/internships-fortune-500-companies/">Computer Science Degree Hub</a>
                | <a href="https://www.wayup.com/s/internships/computer-science/">WayUp</a>
                | <a href="https://www.glassdoor.com/Job/computer-science-intern-jobs-SRCH_KO0,23.htm">Glassdoor</a>
                | <a href="https://www.indeed.com/q-Computer-Science-Intern-jobs.html">Indeed</a>
                | <a href="https://www.linkedin.com/jobs/computer-science-intern-jobs/">LinkedIn</a>
            </li>
            <li><a href="https://www.digitalrights.community/job-board">Digital Rights Community Job Board</a> จะมีประกาศ fellowship/internship รวมถึงตำแหน่งงานที่เกี่ยวกับการใช้ความรู้สาขาคอมพิวเตอร์กับกับสังคม</li>
            <li><a href="https://www.summerschoolsineurope.eu/">Summer Schools in Europe.eu</a> รวมหลักสูตรภาคฤดูร้อนทั่วยุโรป - หลายหลักสูตรมีทุน หรืออาจขอทุนหรืองบอบรมจากองค์กรที่ตัวเองสังกัด</li>
        </ul>
    </div>
  </Layout>
}

export default IndexPage
