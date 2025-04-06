import React from 'react'
import { useNavigate } from 'react-router-dom'

const MainAdmin = () => {
    const navigate = useNavigate();
  return (
    <div>
        <button onClick={(e)=>navigate('/addcompany')}>Add Company</button>
        <br /><br />
        <button onClick={(e)=>navigate('/addmcqs')}>Add mcq</button>
    </div>
  )
}

export default MainAdmin